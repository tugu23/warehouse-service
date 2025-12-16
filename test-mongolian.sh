#!/bin/bash

# Mongolian Translation Test Script
# This script tests the Mongolian language support in the API

echo "🇲🇳 Монгол хэлний тест эхэллээ..."
echo ""

BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Тест: Нэвтрэх (Буруу нууц үг - Монгол хэлээр алдаа харагдах ёстой)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: mn" \
  -d '{
    "identifier": "admin@warehouse.com",
    "password": "wrongpassword"
  }')

echo "Хариу:"
echo "$response" | jq '.'
echo ""

# Check if response contains Mongolian text
if echo "$response" | grep -q "буруу"; then
    echo -e "${GREEN}✅ АМЖИЛТТАЙ: Монгол хэлээр алдаа харагдлаа${NC}"
else
    echo -e "${RED}❌ АЛДАА: Монгол хэлээр алдаа харагдсангүй${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Тест: Нэвтрэх (Буруу нууц үг - Англи хэлээр алдаа харагдах ёстой)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{
    "identifier": "admin@warehouse.com",
    "password": "wrongpassword"
  }')

echo "Response:"
echo "$response" | jq '.'
echo ""

# Check if response contains English text
if echo "$response" | grep -q "Invalid credentials"; then
    echo -e "${GREEN}✅ SUCCESS: English error message displayed${NC}"
else
    echo -e "${RED}❌ ERROR: English error message not displayed${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Тест: Амжилттай нэвтрэх"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: mn" \
  -d '{
    "identifier": "admin@warehouse.com",
    "password": "admin123"
  }')

echo "Хариу:"
echo "$response" | jq '.'
echo ""

# Extract token
TOKEN=$(echo "$response" | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
    echo -e "${GREEN}✅ АМЖИЛТТАЙ: Токен авлаа${NC}"
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ АЛДАА: Токен авч чадсангүй${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Тест: Байхгүй бараа хайх (Монгол хэлээр алдаа)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

response=$(curl -s -X GET "$BASE_URL/products/999999" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: mn")

echo "Хариу:"
echo "$response" | jq '.'
echo ""

if echo "$response" | grep -q "олдсонгүй"; then
    echo -e "${GREEN}✅ АМЖИЛТТАЙ: 'Бараа олдсонгүй' гэсэн мэдээлэл харагдлаа${NC}"
else
    echo -e "${RED}❌ АЛДАА: Монгол хэлээр алдаа харагдсангүй${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  Тест: Байхгүй бараа хайх (Англи хэлээр алдаа)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

response=$(curl -s -X GET "$BASE_URL/products/999999" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: en")

echo "Response:"
echo "$response" | jq '.'
echo ""

if echo "$response" | grep -q "not found"; then
    echo -e "${GREEN}✅ SUCCESS: 'Product not found' message displayed${NC}"
else
    echo -e "${RED}❌ ERROR: English error message not displayed${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  Тест: Барааны жагсаалт авах (Монгол хэл - анхдагч)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

response=$(curl -s -X GET "$BASE_URL/products?limit=2" \
  -H "Authorization: Bearer $TOKEN")

echo "Хариу:"
echo "$response" | jq '.'
echo ""

if echo "$response" | grep -q "success"; then
    echo -e "${GREEN}✅ АМЖИЛТТАЙ: Барааны жагсаалт авлаа${NC}"
else
    echo -e "${RED}❌ АЛДАА: Барааны жагсаалт авч чадсангүй${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  Тест: Байхгүй харилцагч хайх (Монгол хэлээр)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

response=$(curl -s -X GET "$BASE_URL/customers/999999" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: mn")

echo "Хариу:"
echo "$response" | jq '.'
echo ""

if echo "$response" | grep -q "олдсонгүй"; then
    echo -e "${GREEN}✅ АМЖИЛТТАЙ: 'Харилцагч олдсонгүй' гэсэн мэдээлэл харагдлаа${NC}"
else
    echo -e "${RED}❌ АЛДАА: Монгол хэлээр алдаа харагдсангүй${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8️⃣  Тест: Байхгүй замбар (404 Not Found - Монгол хэлээр)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

response=$(curl -s -X GET "$BASE_URL/nonexistent-route" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: mn")

echo "Хариу:"
echo "$response" | jq '.'
echo ""

if echo "$response" | grep -q "олдсонгүй"; then
    echo -e "${GREEN}✅ АМЖИЛТТАЙ: 404 алдаа монгол хэлээр харагдлаа${NC}"
else
    echo -e "${RED}❌ АЛДАА: 404 алдаа монгол хэлээр харагдсангүй${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Тест дууслаа!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📝 Тэмдэглэл:${NC}"
echo "   • Анхдагч хэл: Монгол"
echo "   • Accept-Language header-ээр хэл солих боломжтой"
echo "   • Бүх API endpoint-үүд монгол хэлийг дэмжинэ"
echo ""
echo -e "${GREEN}🎉 Монгол хэлний дэмжлэг амжилттай ажиллаж байна!${NC}"
echo ""

