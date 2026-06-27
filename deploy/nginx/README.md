# Nginx strangler routing for Warranty Wallet

Phase 1 routes marketing pages to **Next.js** (`:3001`) and everything else to **Express** (`:3000`).

## Do I need the VPS folder?

**Not required to scaffold Phase 1 locally**, but sharing your live Nginx config helps validate:

- Exact `server_name` and TLS blocks
- Whether `/warrantywallet` is already proxied differently
- Existing `proxy_params` or custom headers
- Conflicts with other apps on the same domain

If you can paste or copy `/etc/nginx/sites-enabled/*` (redact secrets), we can tailor the snippet to match production exactly.

## Files

| File | Purpose |
|------|---------|
| `warranty-wallet-next.conf` | Drop-in location blocks for the strangler router |

## VPS setup

1. Ensure Docker Compose runs both services:

   ```bash
   docker compose ps
   # warranty_backend  -> 0.0.0.0:3000
   # warranty_next     -> 0.0.0.0:3001
   ```

2. Copy the snippet:

   ```bash
   sudo cp deploy/nginx/warranty-wallet-next.conf /etc/nginx/snippets/warranty-wallet-next.conf
   ```

3. Include it **inside** your existing `server { }` block for `dejanvitomirov.com` (replace any previous single upstream for `/warrantywallet`):

   ```nginx
   server {
       listen 443 ssl;
       server_name dejanvitomirov.com www.dejanvitomirov.com;

       # ... your existing ssl_certificate directives ...

       include /etc/nginx/snippets/warranty-wallet-next.conf;
   }
   ```

4. Test and reload:

   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

## Verification

```bash
# Marketing (Next.js) — title should appear in raw HTML (SSR)
curl -s https://dejanvitomirov.com/warrantywallet/ | grep -o '<title>[^<]*</title>'
curl -sI https://dejanvitomirov.com/warrantywallet/about | head -1

# Login on Next (or legacy fallback if Next is down)
curl -sI https://dejanvitomirov.com/warrantywallet/login | head -1
curl -s https://dejanvitomirov.com/warrantywallet/api/test
```

## Auto-fallback (Next → Express)

`warranty-wallet.conf` sends Next.js routes to `:3001` first. If Next returns **502, 503, or 504**, nginx automatically serves the legacy Vite SPA from Express (`:3000`) — same UI, no config swap.

**Not covered:** `/_next/` static assets (only used when Next HTML is served). API and uploads always go to Express.

### Test on VPS (before or after merge to main)

```bash
cd /home/root/projects/warranty-wallet
git fetch && git checkout signin   # or your branch with the updated conf

# 1. Apply config (dry-run first)
sudo cp deploy/nginx/warranty-wallet.conf /etc/nginx/sites-available/warranty-wallet.conf
sudo nginx -t

# 2. Baseline — Next healthy (expect HTTP/2 200, HTML contains Next markers or SSR title)
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/ | head -1
curl -s --max-time 5 https://dejanvitomirov.com/warrantywallet/ | grep -o '<title>[^<]*</title>'

# 3. Reload nginx with new fallback rules
sudo systemctl reload nginx

# 4. Simulate Next down
docker compose stop next
sleep 2

# 5. Fallback — should be 200, legacy Vite (look for /warrantywallet/assets/ in HTML, not /_next/)
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/ | head -1
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/login | head -1
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/about | head -1
curl -s --max-time 5 https://dejanvitomirov.com/warrantywallet/ | grep -E '_next/|/warrantywallet/assets/'

# 6. Legacy-only routes should still work (never depended on Next)
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/dashboard | head -1

# 7. API unchanged
curl -s --max-time 5 https://dejanvitomirov.com/warrantywallet/api/test

# 8. Restore Next
docker compose up -d next
sleep 5
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/ | head -1
```

**What to look for in the browser:** open DevTools → Network. With Next up, document requests may show `_next/static/...`. With Next stopped, page should still load and assets should come from `/warrantywallet/assets/...` (Vite).

**Logs:** `sudo tail -f /var/log/nginx/error.log` while stopping Next — expect upstream connect errors, then successful fallback responses.

## Local development without Nginx

Run both apps and hit Next directly:

```bash
# Terminal 1 — Express API + legacy SPA
cd src/backend && npm run dev   # or docker compose -f docker-compose.dev.yml up

# Terminal 2 — Next marketing
cd src/next && npm run dev      # http://localhost:3001/warrantywallet/
```

For full strangler testing locally, use Docker Compose production stack or install Nginx locally with the same snippet pointing to `127.0.0.1:3000` and `127.0.0.1:3001`.

## Rollback

Remove the `include` line and restore your previous single-upstream block for `/warrantywallet/` → Express. Marketing pages revert to the Vite SPA instantly; no database changes involved.
