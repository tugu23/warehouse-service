#!/usr/bin/env bash
# OasisERP backend deploy — зөвхөн backend service-ийг шинэчилнэ.
# PostgreSQL болон frontend хэвээр үлдэнэ. DB migration ажиллахгүй.
#
# Ашиглалт:
#   ssh root@43.231.115.209 'bash -s' < deploy-backend-only.sh

set -euo pipefail

cd /root/warehouse-service 2>/dev/null || cd "$(dirname "$(find / -name docker-compose.yml -path '*warehouse*' 2>/dev/null | head -1)")"

echo "=== 1. BEFORE: ажиллаж буй backend image ==="
docker inspect warehouse-backend --format '{{.Config.Image}} digest={{.Image}}'
docker compose ps backend

echo
echo "=== 2. Rolling pull: шинэ image татах ==="
docker compose pull backend

echo
echo "=== 2b. Backend image тохиргоог шалгах ==="
grep -n -A4 "^  backend:" docker-compose.yml | head -6
echo "--- шинэ image digest ---"
docker inspect docker.io/tmshuu/warehouse-service:latest --format '{{index .RepoDigests 0}}' 2>/dev/null || true

echo
echo "=== 3. Зөвхөн backend-ийг шинэчлэх ==="
# --no-build: compose дээр "build: ." байсан ч локал кодоос rebuild хийхгүй,
# татсан registry image-ийг яг ашиглана. --no-deps: postgres/frontend хэвээр.
docker compose up -d --no-deps --no-build --force-recreate backend

echo
echo "=== 4. Health хүлээх (60s) ==="
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000/health > /dev/null; then
    echo "backend healthy after ${i}x2s"
    break
  fi
  sleep 2
done
curl -s http://localhost:3000/health; echo

echo
echo "=== 5. AFTER: шинэ image ==="
docker inspect warehouse-backend --format '{{.Config.Image}} digest={{.Image}}'

echo
echo "=== 6. Контейнерүүдийн статус ==="
docker compose ps

echo
echo "=== 7. PostgreSQL хэвээр үлдсэн эсэхийг баталгаажуулах ==="
docker inspect warehouse-db --format 'db started={{.State.StartedAt}} running={{.State.Running}}'

echo
echo "=== 8. Logs (сүүлийн 30) ==="
docker logs --tail 30 warehouse-backend

echo
echo "=== DONE ==="
