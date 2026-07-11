# Nginx routing for Warranty Wallet

All user-facing pages are served by **Next.js** (`:3001`). **Express** (`:3000`) handles the API and uploads only.

## Files

| File | Purpose |
|------|---------|
| `warranty-wallet.conf` | Full production server block (recommended) |
| `warranty-wallet-next.conf` | Drop-in location blocks for an existing server config |
| `warranty-wallet-emergency.conf` | **Deprecated** — see recovery scripts below |

## VPS setup

1. Ensure Docker Compose runs both services:

   ```bash
   docker compose ps
   # warranty_backend  -> 0.0.0.0:3000
   # warranty_next     -> 0.0.0.0:3001
   ```

2. Apply the full config (or include the snippet):

   ```bash
   sudo cp deploy/nginx/warranty-wallet.conf /etc/nginx/sites-available/warranty-wallet.conf
   sudo nginx -t && sudo systemctl reload nginx
   ```

## Verification

```bash
# All pages on Next.js — title should appear in raw HTML (SSR)
curl -s https://dejanvitomirov.com/warrantywallet/ | grep -o '<title>[^<]*</title>'
curl -sI https://dejanvitomirov.com/warrantywallet/dashboard | head -1

# Legacy warranty URLs redirect to Next paths
curl -sIL https://dejanvitomirov.com/warrantywallet/warranties/details/1 | grep -E '^HTTP|^location'

# API unchanged
curl -s https://dejanvitomirov.com/warrantywallet/api/test
```

## Recovery (Next.js outage)

There is no Vite SPA fallback. If pages fail, restart Next on the VPS:

```bash
bash deploy/scripts/vps-recover-next.sh
# or
bash deploy/scripts/vps-emergency-restore.sh
```

Both scripts apply `warranty-wallet.conf`, restart `next` + `backend`, and verify upstreams.

## Local development without Nginx

```bash
# Terminal 1 — Express API
cd src/backend && npm run dev

# Terminal 2 — Next.js (all pages)
cd src/next && npm run dev      # http://localhost:3001/warrantywallet/
```

## Rollback

Rollback requires redeploying a previous Next.js image tag from GHCR. The API and database are unchanged.

```bash
# On VPS — pin a known-good NEXT_IMAGE in .env.production, then:
docker compose --env-file .env.production pull next
docker compose --env-file .env.production up -d next
```
