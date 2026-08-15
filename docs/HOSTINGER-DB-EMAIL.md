# Manual Hostinger: MySQL + support@bill-store.com

If the agent cannot pass Hostinger 2FA, complete these steps in hPanel, then reply with the DB credentials (or the 2FA code).

## 1. MySQL
Databases → MySQL Databases → create DB + user (ALL privileges).
Save: host, database name, username, password.

## 2. Email
Emails → create **support@bill-store.com**.

## 3. Config file on server
Upload/create `public_html/api/config.local.php`:

```php
<?php
return [
  'db_host' => 'localhost',
  'db_name' => 'YOUR_DB_NAME',
  'db_user' => 'YOUR_DB_USER',
  'db_pass' => 'YOUR_DB_PASS',
  'support_email' => 'support@bill-store.com',
  'cors_origin' => 'https://bill-store.com',
];
```

Visit https://bill-store.com/api/migrate.php to create tables.
