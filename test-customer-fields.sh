#!/bin/bash

# Харилцагчийн API тест скрипт

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:4000/api"

echo -e "${BLUE}=== Харилцагчийн API Тест ===${NC}\n"

# 1. Login admin
echo -e "${BLUE}1. Admin нэвтрэх...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin@warehouse.com",
    "password": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token // empty')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Нэвтрэх амжилтгүй!${NC}"
  echo $LOGIN_RESPONSE | jq '.'
  exit 1
fi

echo -e "${GREEN}✅ Амжилттай нэвтэрлээ${NC}\n"

# 2. Get all customers
echo -e "${BLUE}2. Бүх харилцагчдыг татах...${NC}"
CUSTOMERS_RESPONSE=$(curl -s -X GET "$API_URL/customers" \
  -H "Authorization: Bearer $TOKEN")

echo $CUSTOMERS_RESPONSE | jq '.' > /tmp/customers_test.json

CUSTOMER_COUNT=$(echo $CUSTOMERS_RESPONSE | jq '.data.customers | length // 0')
echo -e "${GREEN}✅ Нийт харилцагч: $CUSTOMER_COUNT${NC}\n"

if [ "$CUSTOMER_COUNT" -eq 0 ]; then
  echo -e "${RED}❌ Харилцагч олдсонгүй!${NC}"
  exit 1
fi

# 3. Check first customer fields
echo -e "${BLUE}3. Эхний харилцагчийн талбаруудыг шалгах...${NC}"
FIRST_CUSTOMER=$(echo $CUSTOMERS_RESPONSE | jq '.data.customers[0]')

echo -e "Харилцагчийн мэдээлэл:"
echo $FIRST_CUSTOMER | jq '{
  id,
  name,
  realName,
  name2,
  legacyCustomerId,
  registrationNumber,
  phoneNumber,
  district,
  isVatPayer,
  paymentTerms,
  direction
}'

# Check if new fields exist
HAS_REAL_NAME=$(echo $FIRST_CUSTOMER | jq 'has("realName")')
HAS_NAME2=$(echo $FIRST_CUSTOMER | jq 'has("name2")')
HAS_LEGACY_ID=$(echo $FIRST_CUSTOMER | jq 'has("legacyCustomerId")')
HAS_DIRECTION=$(echo $FIRST_CUSTOMER | jq 'has("direction")')
HAS_REGISTRATION=$(echo $FIRST_CUSTOMER | jq 'has("registrationNumber")')

echo -e "\n${BLUE}Талбарын шалгалт:${NC}"
[ "$HAS_REAL_NAME" = "true" ] && echo -e "${GREEN}✅ realName${NC}" || echo -e "${RED}❌ realName${NC}"
[ "$HAS_NAME2" = "true" ] && echo -e "${GREEN}✅ name2${NC}" || echo -e "${RED}❌ name2${NC}"
[ "$HAS_LEGACY_ID" = "true" ] && echo -e "${GREEN}✅ legacyCustomerId${NC}" || echo -e "${RED}❌ legacyCustomerId${NC}"
[ "$HAS_DIRECTION" = "true" ] && echo -e "${GREEN}✅ direction${NC}" || echo -e "${RED}❌ direction${NC}"
[ "$HAS_REGISTRATION" = "true" ] && echo -e "${GREEN}✅ registrationNumber (Байгууллагын регистр)${NC}" || echo -e "${RED}❌ registrationNumber${NC}"

echo -e "\n${GREEN}✅ Тест дууслаа!${NC}"
echo -e "${BLUE}Дэлгэрэнгүй мэдээллийг /tmp/customers_test.json файлаас харна уу.${NC}"

