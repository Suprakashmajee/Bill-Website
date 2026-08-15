# How to connect Google AdSense to bill-store.com

## Option A — Agent finishes it (needs phone approval)
1. Agent starts AdSense login
2. You approve the Google prompt on your OnePlus phone
3. Agent copies `ca-pub-...`, updates `ads.txt`, enables ads, deploys, requests site review

## Option B — You paste Publisher ID
1. Open https://adsense.google.com/ while logged into Google
2. Account → Account information → copy Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`)
3. Sites → Add site → `https://bill-store.com` → Request review
4. Paste the Publisher ID in chat

## Site files involved
- `public/ads.txt` → `google.com, pub-XXXXXXXX, DIRECT, f08c47fec0942fa0`
- `src/adsense.ts` → `ADSENSE_CLIENT` + `ADSENSE_ENABLED = true`
- Ad slots render via `AdSlot` / `AdSenseScript`
