<?php
/**
 * Create Bill Store tables if they do not exist.
 * Safe to run multiple times.
 */
declare(strict_types=1);

require_once __DIR__ . '/db.php';

try {
    $pdo = billstore_pdo();
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

    billstore_json_response(['ok' => true, 'message' => 'Database tables are ready.']);
} catch (Throwable $e) {
    billstore_json_response([
        'ok' => false,
        'error' => 'Could not initialize database.',
        'detail' => $e->getMessage(),
    ], 500);
}
