#!/bin/bash
# EMERGENCY: Restores site when Next.js broke nginx (504 / ERR_TIMED_OUT)
# Run on VPS as root: bash deploy/scripts/vps-emergency-restore.sh
set -euo pipefail

cd /home/root/projects/warranty-wallet

echo "==> 1. Kill stuck Next build and stop Next container"
docker compose stop next 2>/dev/null || true
docker kill warranty_next 2>/dev/null || true
pkill -f "docker.*build" 2>/dev/null || true

echo "==> 2. Apply emergency nginx (Express-only, no Next)"
cp deploy/nginx/warranty-wallet-emergency.conf /etc/nginx/sites-available/warranty-wallet.conf
nginx -t
systemctl reload nginx

echo "==> 3. Ensure backend is running"
docker compose up -d backend mysql

echo "==> 4. Test"
sleep 3
curl -sI --max-time 5 http://127.0.0.1:3000/api/test | head -3
curl -sI --max-time 5 https://dejanvitomirov.com/ | head -3
curl -sI --max-time 5 https://dejanvitomirov.com/warrantywallet/ | head -3

echo ""
echo "Site should load now (legacy Vite app, not Next marketing)."
echo "Re-enable Next later with: bash deploy/scripts/vps-recover-next.sh"
