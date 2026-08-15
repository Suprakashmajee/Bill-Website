# Manual Hostinger: MySQL + support@bill-store.com

## 1. MySQL (done)
Created in hPanel for bill-store.com:

| Field | Value |
| --- | --- |
| Database | `u116887753_billstore` |
| User | `u116887753_billstore` |
| Host (PHP) | `localhost` |
| Remote host | `srv1978.hstgr.io` |

Tables `support_messages` and `invoices` are created. Live check: https://bill-store.com/api/migrate.php

Password is stored only in `public_html/api/config.local.php` on the server (not in git).

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
