# API Testing Examples

This file contains example API calls you can use to test the backend with cURL or import into Postman/Insomnia.

## Base URL

```
http://localhost:3000/api
```

## 1. Authentication

### Login as Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin@warehouse.com",
    "password": "admin123"
  }'
```

### Login as Manager

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "manager@warehouse.com",
    "password": "manager123"
  }'
```

### Login as Sales Agent

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "agent@warehouse.com",
    "password": "agent123"
  }'
```

**Save the token from the response and use it in subsequent requests:**

```bash
export TOKEN="your-jwt-token-here"
```

---

## 2. Employees Management (Admin Only)

### Create New Employee

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "New Sales Agent",
    "email": "newagent@warehouse.com",
    "phoneNumber": "+976-99887766",
    "password": "password123",
    "roleName": "SalesAgent"
  }'
```

### Get All Employees

```bash
curl -X GET http://localhost:3000/api/employees?page=1&limit=10 \
  -H "Authorization: Bearer $TOKEN"
```

### Get Employee by ID

```bash
curl -X GET http://localhost:3000/api/employees/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Update Employee

```bash
curl -X PUT http://localhost:3000/api/employees/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Updated Name",
    "isActive": true
  }'
```

### Deactivate Employee

```bash
curl -X DELETE http://localhost:3000/api/employees/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Products Management

### Create Product (Manager/Admin)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nameMongolian": "Цай",
    "nameEnglish": "Tea",
    "productCode": "PROD-004",
    "supplierId": 1,
    "stockQuantity": 100,
    "priceWholesale": 1200.00,
    "priceRetail": 1500.00
  }'
```

### Get All Products

```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=10&search=tea" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Product by ID

```bash
curl -X GET http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Update Product (Manager/Admin)

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nameMongolian": "Ус (шинэчлэгдсэн)",
    "priceRetail": 800.00
  }'
```

### Adjust Inventory (Manager/Admin)

```bash
curl -X POST http://localhost:3000/api/products/inventory/adjust \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": 1,
    "adjustment": 50,
    "reason": "Stock replenishment from supplier"
  }'
```

---

## 4. Customers Management

### Create Customer (Manager/Admin)

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "ABC Store",
    "address": "Peace Avenue, Ulaanbaatar",
    "phoneNumber": "+976-99887766",
    "locationLatitude": 47.918869,
    "locationLongitude": 106.917580,
    "customerTypeId": 1,
    "assignedAgentId": 3
  }'
```

### Get All Customers

```bash
curl -X GET "http://localhost:3000/api/customers?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Customer by ID

```bash
curl -X GET http://localhost:3000/api/customers/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Update Customer (Manager/Admin)

```bash
curl -X PUT http://localhost:3000/api/customers/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "ABC Store (Updated)",
    "phoneNumber": "+976-99887799"
  }'
```

---

## 5. Orders Management

### Create Order (All Authenticated Users)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "customerId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 10
      },
      {
        "productId": 2,
        "quantity": 5
      }
    ]
  }'
```

### Get All Orders

```bash
curl -X GET "http://localhost:3000/api/orders?page=1&limit=10&status=Pending" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Orders by Customer

```bash
curl -X GET "http://localhost:3000/api/orders?customerId=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Order by ID

```bash
curl -X GET http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Update Order Status (Manager/Admin)

```bash
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "Fulfilled"
  }'
```

---

## 6. Returns Management (Manager/Admin Only)

### Create Return

```bash
curl -X POST http://localhost:3000/api/returns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderId": 1,
    "productId": 1,
    "quantity": 2,
    "reason": "Damaged during transport"
  }'
```

### Get All Returns

```bash
curl -X GET "http://localhost:3000/api/returns?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Return by ID

```bash
curl -X GET http://localhost:3000/api/returns/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7. Geolocation Tracking

### Record Agent Location

```bash
curl -X POST http://localhost:3000/api/agents/3/location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "latitude": 47.918869,
    "longitude": 106.917580
  }'
```

### Get Agent Route (Manager/Admin)

```bash
curl -X GET "http://localhost:3000/api/agents/3/route?startDate=2025-10-01&endDate=2025-10-31" \
  -H "Authorization: Bearer $TOKEN"
```

### Get All Agent Locations for Today (Manager/Admin)

```bash
curl -X GET "http://localhost:3000/api/agents/locations/all?date=2025-10-25" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 8. Utility Endpoints

### Health Check (No Auth Required)

```bash
curl -X GET http://localhost:3000/health
```

---

## Testing Workflow Example

Here's a complete workflow to test the system:

```bash
# 1. Login as Admin
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@warehouse.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. Get all products
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer $TOKEN"

# 3. Create a customer (as Manager)
MANAGER_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"manager@warehouse.com","password":"manager123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MANAGER_TOKEN" \
  -d '{
    "name": "Test Store",
    "address": "Test Address",
    "phoneNumber": "+976-12345678",
    "customerTypeId": 1,
    "assignedAgentId": 3
  }'

# 4. Create an order (as Sales Agent)
AGENT_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"agent@warehouse.com","password":"agent123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AGENT_TOKEN" \
  -d '{
    "customerId": 1,
    "items": [
      {"productId": 1, "quantity": 5}
    ]
  }'

# 5. Record agent location
curl -X POST http://localhost:3000/api/agents/3/location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AGENT_TOKEN" \
  -d '{
    "latitude": 47.918869,
    "longitude": 106.917580
  }'

echo "Workflow test completed!"
```

---

## Error Handling Examples

### Invalid Credentials

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "wrong@email.com",
    "password": "wrongpassword"
  }'
```

Expected: `401 Unauthorized`

### Missing Authentication

```bash
curl -X GET http://localhost:3000/api/products
```

Expected: `401 Unauthorized`

### Insufficient Permissions

```bash
# Try to create employee as Sales Agent
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AGENT_TOKEN" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "password": "pass123",
    "roleName": "SalesAgent"
  }'
```

Expected: `403 Forbidden`

---

## Notes

- Replace `$TOKEN` with your actual JWT token
- All timestamps are in ISO 8601 format
- Pagination parameters: `?page=1&limit=10`
- Date format: `YYYY-MM-DD` or full ISO 8601
- All endpoints return JSON responses

For more details, see the main README.md file.
