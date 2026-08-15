<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';
billstore_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    billstore_json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    billstore_json_response(['ok' => false, 'error' => 'Invalid JSON body'], 400);
}

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$message = trim((string)($data['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    billstore_json_response(['ok' => false, 'error' => 'Name, email, and message are required.'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    billstore_json_response(['ok' => false, 'error' => 'Please enter a valid email address.'], 400);
}
if (mb_strlen($message) > 5000) {
    billstore_json_response(['ok' => false, 'error' => 'Message is too long.'], 400);
}

try {
    $pdo = billstore_pdo();
    // Ensure table exists (first request after deploy)
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS support_messages (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(160) NOT NULL,
            email VARCHAR(190) NOT NULL,
            message TEXT NOT NULL,
            ip VARCHAR(64) NULL,
            user_agent VARCHAR(255) NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_support_created (created_at),
            INDEX idx_support_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $stmt = $pdo->prepare(
        'INSERT INTO support_messages (name, email, message, ip, user_agent)
         VALUES (:name, :email, :message, :ip, :ua)'
    );
    $stmt->execute([
        ':name' => mb_substr($name, 0, 160),
        ':email' => mb_substr($email, 0, 190),
        ':message' => $message,
        ':ip' => $_SERVER['REMOTE_ADDR'] ?? null,
        ':ua' => isset($_SERVER['HTTP_USER_AGENT']) ? mb_substr($_SERVER['HTTP_USER_AGENT'], 0, 255) : null,
    ]);

    $id = (int)$pdo->lastInsertId();
    $supportTo = billstore_config()['support_email'] ?? 'support@bill-store.com';

    // Best-effort notification email (may be disabled on some hosts)
    $subject = 'Bill Store support message #' . $id;
    $body = "New support message from {$name} <{$email}>\n\n{$message}\n";
    @mail($supportTo, $subject, $body, 'From: noreply@bill-store.com');

    billstore_json_response(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    billstore_json_response([
        'ok' => false,
        'error' => 'Could not save your message. Please email support@bill-store.com directly.',
    ], 500);
}
