<?php
/**
 * Database connection for Bill Store (Hostinger MySQL).
 * Credentials are loaded from config.local.php (not committed) or environment variables.
 */
declare(strict_types=1);

function billstore_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $defaults = [
        'db_host' => getenv('BILLSTORE_DB_HOST') ?: 'localhost',
        'db_name' => getenv('BILLSTORE_DB_NAME') ?: '',
        'db_user' => getenv('BILLSTORE_DB_USER') ?: '',
        'db_pass' => getenv('BILLSTORE_DB_PASS') ?: '',
        'support_email' => 'support@bill-store.com',
        'cors_origin' => 'https://bill-store.com',
    ];

    $local = __DIR__ . '/config.local.php';
    if (is_file($local)) {
        /** @var array $fileConfig */
        $fileConfig = require $local;
        $defaults = array_merge($defaults, $fileConfig);
    }

    $config = $defaults;
    return $config;
}

function billstore_pdo(): PDO
{
    $c = billstore_config();
    if ($c['db_name'] === '' || $c['db_user'] === '') {
        throw new RuntimeException('Database is not configured yet.');
    }

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $c['db_host'], $c['db_name']);
    $pdo = new PDO($dsn, $c['db_user'], $c['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

function billstore_json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function billstore_cors(): void
{
    $origin = billstore_config()['cors_origin'] ?? 'https://bill-store.com';
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
