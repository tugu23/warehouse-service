#!/usr/bin/env bash
# A3: Deploy-ийн дараах read-only шалгалт.
# Ямар ч өгөгдөл үүсгэхгүй, устгахгүй. зөвхөн GET.
#
# Ашиглалт:
#   bash verify-production-readonly.sh

set -uo pipefail

BASE="${BASE:-https://oasiserp.mn/api}"
# Credentials must be provided by the caller, e.g.
#   EMAIL=... PASSWORD=... bash verify-production-readonly.sh
EMAIL="${EMAIL:?EMAIL must be set}"
PASSWORD="${PASSWORD:?PASSWORD must be set}"

pass() { printf "  ✓ %s\n" "$1"; }
fail() { printf "  ✗ %s\n" "$1"; FAILURES=$((FAILURES+1)); }
FAILURES=0

echo "=== 1. Agent login ==="
LOGIN=$(curl -s --max-time 20 -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
TOKEN=$(printf '%s' "$LOGIN" | python3 -c "import json,sys;print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
ROLE=$(printf '%s' "$LOGIN" | python3 -c "import json,sys;print(json.load(sys.stdin)['data']['user']['role'])" 2>/dev/null)
if [ -n "$TOKEN" ]; then pass "login 200, role=$ROLE"; else fail "login failed"; echo "$LOGIN"; exit 1; fi

AUTH=(-H "Authorization: Bearer $TOKEN")

echo
echo "=== 2. Agent KPI endpoints (200 байх ёстой) ==="
FROM=$(date -u -v-30d +%Y-%m-%d 2>/dev/null || date -u -d '30 days ago' +%Y-%m-%d)
TO=$(date -u +%Y-%m-%d)
for ep in "agent-kpi/dashboard-summary?from=$FROM&to=$TO" "agent-kpi/trend-data?from=$FROM&to=$TO&granularity=day"; do
  CODE=$(curl -s --max-time 25 -o /tmp/_a3.json -w "%{http_code}" "$BASE/$ep" "${AUTH[@]}")
  if [ "$CODE" = "200" ]; then pass "$ep -> 200"; else fail "$ep -> $CODE"; fi
done

echo
echo "=== 3. passwordHash байхгүй эсэх ==="
for ep in "orders?limit=5" "customers?limit=5" "products?limit=5" "employees/me" "employees"; do
  N=$(curl -s --max-time 25 "$BASE/$ep" "${AUTH[@]}" | grep -o passwordHash | wc -l | tr -d ' ')
  if [ "$N" = "0" ]; then pass "$ep -> passwordHash 0"; else fail "$ep -> passwordHash $N"; fi
done

echo
echo "=== 4. Үндсэн endpoint-ууд (200 байх ёстой) ==="
for ep in "orders?limit=3" "products?limit=3" "customers?limit=3" "categories" "delivery-plans"; do
  CODE=$(curl -s --max-time 25 -o /dev/null -w "%{http_code}" "$BASE/$ep" "${AUTH[@]}")
  if [ "$CODE" = "200" ]; then pass "$ep -> 200"; else fail "$ep -> $CODE"; fi
done

echo
echo "=== 5. Web frontend ажиллаж байгаа эсэх ==="
# /health нь зөвхөн сервер дотроос хандагдах тул ойлгомж орхино.
for url in "https://oasiserp.mn/" "https://oasiserp.mn/api-docs/"; do
  CODE=$(curl -s --max-time 25 -o /dev/null -w "%{http_code}" "$url")
  if [ "$CODE" = "200" ]; then pass "$url -> 200"; else fail "$url -> $CODE"; fi
done

echo
echo "=== 6. Үл хэвтээр үлдсэн эсэх (бодит өгөгдөл өөрчлөгдөөгүй) ==="
STOCK=$(curl -s --max-time 25 "$BASE/products?limit=600" "${AUTH[@]}" | python3 -c "
import json,sys,collections
d=json.load(sys.stdin)
ps=d['data']['products']
c=collections.Counter(p.get('stockQuantity') for p in ps)
print(f\"total={len(ps)} dist={c.most_common(4)}\")
" 2>/dev/null)
echo "  products stock: $STOCK"

echo
if [ "$FAILURES" -eq 0 ]; then
  echo "=== БҮГД АМЖИЛТТАЙ (0 failure) ==="
else
  echo "=== $FAILURES FAILURE ==="
fi
exit $FAILURES
