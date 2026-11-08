#!/usr/bin/env bash
# OasisERP backend ROLLBACK — хуучин production image-ийг буцаан солино.
#
# Rollback-ийн зорилт: backend-ийг deploy-ийн өмнөх код руу буцааж,
# шинэ feature-уудыг арилгах. PostgreSQL болон frontend хэвээр.
#
# Ашиглалт:
#   ssh root@43.231.115.209 'bash -s' < rollback-backend.sh
#
# Эхний удаа: docker.io/tmshuu/warehouse-service:rollback-767e363
# (2026-10-31-ийн production image, commit 767e363-ын код)

set -euo pipefail

ROLLBACK_TAG="${ROLLBACK_TAG:-docker.io/tmshuu/warehouse-service:rollback-767e363}"

cd /root/warehouse-service 2>/dev/null || cd "$(dirname "$(find / -name docker-compose.yml -path '*warehouse*' 2>/dev/null | head -1)")"

echo "=== 1. Одоогийн backend image ==="
docker inspect warehouse-backend --format '{{.Image}}'

echo
echo "=== 2. Rollback image татах ==="
docker pull "$ROLLBACK_TAG"

echo
echo "=== 3. Compose-ийн backend image-ийг rollback tag болгох ==="
cp docker-compose.yml docker-compose.yml.bak.$(date +%Y%m%d%H%M%S)
# backend service-ийн image мөрийг солих (энд зөвхөн backend хэсэг)
python3 - <<PYEOF
import re
p = "docker-compose.yml"
s = open(p).read()
s = re.sub(
    r"(  backend:\n(?:.*\n)*?\s+image:\s*)docker\.io/tmshuu/warehouse-service:[^\s]+",
    r"\g<1>${ROLLBACK_TAG}",
    s,
    count=1,
)
open(p, "w").write(s)
print("compose updated")
PYEOF
grep -n -A3 "^  backend:" docker-compose.yml | head -5

echo
echo "=== 4. Зөвхөн backend-ийг шинэчлэх ==="
docker compose up -d --no-deps backend

echo
echo "=== 5. Health хүлээх ==="
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000/health > /dev/null; then
    echo "backend healthy after ${i}x2s"
    break
  fi
  sleep 2
done
curl -s http://localhost:3000/health; echo

echo
echo "=== 6. Статус ==="
docker compose ps
docker inspect warehouse-db --format 'db started={{.State.StartedAt}} running={{.State.Running}}'

echo
echo "=== 7. Logs ==="
docker logs --tail 20 warehouse-backend

echo
echo "=== ROLLBACK DONE ==="
