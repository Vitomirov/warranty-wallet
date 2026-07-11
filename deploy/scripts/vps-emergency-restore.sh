#!/bin/bash
# EMERGENCY: Restores site when Next.js is down (502/504 / ERR_TIMED_OUT)
# Run on VPS as root: bash deploy/scripts/vps-emergency-restore.sh
set -euo pipefail

cd /home/root/projects/warranty-wallet

echo "==> 1. Kill stuck Next build and stop Next container"
docker compose stop next 2>/dev/null || true
docker kill warranty_next 2>/dev/null || true
pkill -f "docker.*build" 2>/dev/null || true

echo "==> 2. Apply production nginx (Next.js pages, Express API)"
cp deploy/nginx/warranty-wallet.conf /etc/nginx/sites-available/warranty-wallet.conf
nginx -t
systemctl reload nginx

echo "==> 3. Ensure backend + Next are running"
docker compose up -d backend mysql next

echo "==> 4. Wait for Next..."
for i in $(seq 1 30); do
  if curl -sf --max-time 3 http://127.0.0.1:3001/warrantywallet/ >/dev/null 2>&1; then
    echo "Next is responding."
    break
  fi
  echo "  waiting... ($i/30)"
  sleep 5
done

echo "==> 5. Test"
sleep 3
curl -sI --max-time 5 http://127.0.0.1:3000/api/test | head -3
curl -sI --max-time 5 http://127.0.0.1:3001/warrantywallet/ | head -3
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/ | head -3

echo ""
echo "Site should load via Next.js. For a full recovery run: bash deploy/scripts/vps-recover-next.sh"
