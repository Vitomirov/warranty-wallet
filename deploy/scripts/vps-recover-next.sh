#!/bin/bash
# Run on VPS as root: bash deploy/scripts/vps-recover-next.sh
set -euo pipefail

cd /home/root/projects/warranty-wallet

echo "==> Stop stuck builds and free memory"
docker compose stop next 2>/dev/null || true
docker builder prune -f 2>/dev/null || true

echo "==> Pull latest config (or skip if running manually)"
# git pull origin main

echo "==> Rebuild and start Next (port 3001 inside and outside)"
docker compose up -d --build next

echo "==> Wait for Next health..."
for i in $(seq 1 30); do
  if curl -sf --max-time 3 http://127.0.0.1:3001/warrantywallet/ >/dev/null 2>&1 || \
     curl -sf --max-time 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:3001/warrantywallet | grep -qE '200|308'; then
    echo "Next is responding."
    break
  fi
  echo "  waiting... ($i/30)"
  sleep 5
done

echo "==> Test upstreams"
curl -sI --max-time 5 http://127.0.0.1:3001/warrantywallet/ | head -3
curl -sI --max-time 5 http://127.0.0.1:3000/api/test | head -3

echo "==> Reload nginx"
nginx -t && systemctl reload nginx

echo "==> Done. Test: curl -sI https://dejanvitomirov.com/warrantywallet/ | head -5"
