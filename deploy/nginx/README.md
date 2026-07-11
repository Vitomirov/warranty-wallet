# Nginx strangler routing for Warranty Wallet

All user-facing pages are served by **Next.js** (`:3001`). **Express** (`:3000`) handles the API, uploads, and emergency Vite SPA fallback when Next is unavailable.

## Files

| File | Purpose |
|------|---------|
| `warranty-wallet.conf` | Full production server block (recommended) |
| `warranty-wallet-next.conf` | Drop-in location blocks for an existing server config |

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
curl -sI https://dejanvitomirov.com/warrantywallet/warranties/details/1 | head -3

# API unchanged
curl -s https://dejanvitomirov.com/warrantywallet/api/test
```

## Auto-fallback (Next → Express)

`warranty-wallet.conf` sends all `/warrantywallet/*` page requests to `:3001`. If Next returns **502, 503, or 504**, nginx automatically serves the legacy Vite SPA from Express (`:3000`).

**Not covered:** `/_next/` static assets (only used when Next HTML is served). API and uploads always go to Express.

### Test on VPS

```bash
cd /home/root/projects/warranty-wallet

# 1. Apply config
sudo cp deploy/nginx/warranty-wallet.conf /etc/nginx/sites-available/warranty-wallet.conf
sudo nginx -t && sudo systemctl reload nginx

# 2. Baseline — Next healthy
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/ | head -1
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/dashboard | head -1

# 3. Legacy URL redirect
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/warranties/details/1 | head -3

# 4. Simulate Next down
docker compose stop next
sleep 2

# 5. Fallback — should be 200, legacy Vite
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/ | head -1
curl -s --max-time 5 https://dejanvitomirov.com/warrantywallet/ | grep -E '_next/|/warrantywallet/assets/'

# 6. Restore Next
docker compose up -d next
```

## Local development without Nginx

```bash
# Terminal 1 — Express API
cd src/backend && npm run dev

# Terminal 2 — Next.js (all pages)
cd src/next && npm run dev      # http://localhost:3001/warrantywallet/
```

## Rollback

Point `/warrantywallet/` back to Express (`:3000`) and remove Next upstream blocks. The legacy Vite SPA serves all pages instantly; no database changes involved.
