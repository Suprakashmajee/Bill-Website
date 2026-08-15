# Bill Store

Free online invoice generator for [bill-store.com](https://bill-store.com/).

Inspired by the workflow of classic browser invoice makers: fill in a live invoice form, customize currency and accent color, then download a PDF — no signup required.

## Features

- Live invoice editor (from / bill to / ship to, dates, terms, PO)
- Line items with quantity, rate, and auto-calculated amounts
- Tax, discount, and shipping adjustments
- Logo upload and accent color presets
- Multi-currency formatting
- Client-side PDF download

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm install
npm run build
```

Static files are written to `dist/` (includes `.htaccess` for Hostinger).

## Deploy to Hostinger (bill-store.com)

Your domain already points at Hostinger (`dns-parking.com` nameservers). Deploy the built site into `public_html`.

### Option A — Automatic (GitHub Actions + FTP)

1. In Hostinger hPanel → **Files** → **FTP Accounts**, copy host / username / password.
2. In GitHub → repo **Settings** → **Secrets and variables** → **Actions**, add:
   - `HOSTINGER_FTP_HOST`
   - `HOSTINGER_FTP_USER`
   - `HOSTINGER_FTP_PASSWORD`
3. Merge to `main` (or run the **Deploy to Hostinger** workflow manually).

### Option B — Manual upload

1. Run `npm run build`
2. Zip the contents of `dist/`
3. In hPanel → **File Manager** → open `public_html`
4. Upload and extract the zip so `index.html` sits directly in `public_html`
5. Enable **SSL** in hPanel if it is not already active

### Option C — Vercel

```bash
npx vercel --prod
```

Then add `bill-store.com` as a custom domain in the Vercel project and update DNS if you move off Hostinger.
