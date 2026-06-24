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

# Legacy app still on Express
curl -sI https://dejanvitomirov.com/warrantywallet/login | head -1
curl -s https://dejanvitomirov.com/warrantywallet/api/test
```

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
