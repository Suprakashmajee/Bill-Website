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

$invoiceNumber = trim((string)($data['invoiceNumber'] ?? $data['invoice_number'] ?? ''));
$currency = strtoupper(trim((string)($data['currency'] ?? 'USD')));
$from = (string)($data['from'] ?? '');
$billTo = (string)($data['billTo'] ?? $data['bill_to'] ?? '');
$subtotal = (float)($data['subtotal'] ?? 0);
$total = (float)($data['total'] ?? 0);
$balanceDue = (float)($data['balanceDue'] ?? $data['balance_due'] ?? 0);

if ($invoiceNumber === '') {
    billstore_json_response(['ok' => false, 'error' => 'invoiceNumber is required'], 400);
}
if (strlen($currency) !== 3) {
    $currency = 'USD';
}

try {
    $pdo = billstore_pdo();
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS invoices (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            invoice_number VARCHAR(64) NOT NULL,
            currency CHAR(3) NOT NULL DEFAULT \'USD\',
            from_text TEXT NULL,
            bill_to TEXT NULL,
            payload_json LONGTEXT NOT NULL,
            subtotal DECIMAL(14,2) NOT NULL DEFAULT 0,
            total DECIMAL(14,2) NOT NULL DEFAULT 0,
            balance_due DECIMAL(14,2) NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_invoice_number (invoice_number),
            INDEX idx_invoice_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $stmt = $pdo->prepare(
        'INSERT INTO invoices
            (invoice_number, currency, from_text, bill_to, payload_json, subtotal, total, balance_due)
         VALUES
            (:num, :cur, :from_text, :bill_to, :payload, :subtotal, :total, :balance)'
    );
    $stmt->execute([
        ':num' => mb_substr($invoiceNumber, 0, 64),
        ':cur' => $currency,
        ':from_text' => $from,
        ':bill_to' => $billTo,
        ':payload' => json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ':subtotal' => $subtotal,
        ':total' => $total,
        ':balance' => $balanceDue,
    ]);

    billstore_json_response(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);
} catch (Throwable $e) {
    billstore_json_response(['ok' => false, 'error' => 'Could not save invoice.'], 500);
}
