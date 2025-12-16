# Warehouse Goods Registration and Sales Management System - Backend

A secure, scalable, and robust RESTful API backend for managing warehouse operations, inventory, sales, and customer relationships.

## 🇲🇳 Монгол хэлний дэмжлэг / Mongolian Language Support

**🎉 Энэхүү API нь монгол хэлийг бүрэн дэмжинэ!**

- ✅ Бүх алдааны мэдээлэл монголоор
- ✅ Анхдагч хэл: Монгол
- ✅ Accept-Language header-ээр хэл солих боломжтой
- ✅ 200+ монгол орчуулга

Дэлгэрэнгүй: [MONGOLIAN_TRANSLATION_GUIDE.md](MONGOLIAN_TRANSLATION_GUIDE.md)

## 🚀 Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Logging**: Winston + Morgan
- **Build Tool**: Webpack 5
- **i18n**: Custom translation system (Mongolian + English)

## 📋 Features

- ✅ Role-based access control (Admin, Manager, SalesAgent)
- ✅ JWT-based authentication
- ✅ Complete CRUD operations for employees, products, customers, orders
- ✅ Transactional order processing with automatic stock management
- ✅ Product returns with inventory reconciliation
- ✅ Real-time GPS location tracking for sales agents
- ✅ Comprehensive input validation and error handling
- ✅ Rate limiting and security features
- ✅ Pagination for all list endpoints
- ✅ Detailed logging and monitoring
- ✅ **Mongolian language support (default)**
- ✅ **Multi-language API responses**

## 🏗️ Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding script
├── src/
│   ├── config/
│   │   └── index.ts           # Application configuration
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── employees.controller.ts
│   │   ├── products.controller.ts
│   │   ├── customers.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── returns.controller.ts
│   │   └── agents.controller.ts
│   ├── db/
│   │   └── prisma.ts          # Prisma client instance
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── employees.routes.ts
│   │   ├── products.routes.ts
│   │   ├── customers.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── returns.routes.ts
│   │   └── agents.routes.ts
│   ├── utils/
│   │   └── logger.ts
│   ├── app.ts                 # Express application
│   └── server.ts              # Server entry point
├── logs/                      # Application logs (auto-generated)
├── dist/                      # Compiled output (auto-generated)
├── .env                       # Environment variables
├── .env.example               # Environment variables template
├── package.json
├── tsconfig.json
├── webpack.config.js
└── nodemon.json
```

## 🔧 Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

**OR** use containers (recommended for quick setup):

- **Docker** (v20.10+) + Docker Compose (v2.0+)
- **OR Podman** (v4.0+) + podman-compose

### Option 1: Docker/Podman (Recommended) 🐳

```bash
# Quick start (auto-detects Docker or Podman)
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh

# Or manually with Docker
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx ts-node prisma/seed.ts

# Or manually with Podman
podman-compose up -d
podman-compose exec backend npx prisma migrate deploy
podman-compose exec backend npx ts-node prisma/seed.ts
```

See [DOCKER.md](DOCKER.md) for complete Docker/Podman documentation.

### Option 2: Manual Installation

#### Steps

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your database connection and other settings:

   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL="postgresql://username:password@localhost:5432/warehouse_db?schema=public"
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=8h
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

4. **Set up the database**

   Create a PostgreSQL database:

   ```bash
   createdb warehouse_db
   ```

   Run Prisma migrations:

   ```bash
   npm run prisma:migrate
   ```

   Generate Prisma Client:

   ```bash
   npm run prisma:generate
   ```

5. **Seed the database (optional)**

   ```bash
   npx ts-node prisma/seed.ts
   ```

   This will create:

   - Default roles (Admin, Manager, SalesAgent)
   - Sample users (see credentials below)
   - Sample customer types
   - Sample products

## 🚀 Running the Application

### Development mode (with hot reload)

```bash
npm run dev
```

### Production mode

```bash
npm run build
npm start
```

### Access Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

## 🔐 Default Users (After Seeding)

| Role        | Email                 | Password   |
| ----------- | --------------------- | ---------- |
| Admin       | admin@warehouse.com   | admin123   |
| Manager     | manager@warehouse.com | manager123 |
| Sales Agent | agent@warehouse.com   | agent123   |

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Health Check

```
GET /health
```

### Authentication

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "admin@warehouse.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "System Administrator",
      "email": "admin@warehouse.com",
      "role": "Admin"
    }
  }
}
```

### Protected Routes

All routes below require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### Employees Module (Admin Only)

#### Create Employee

```http
POST /api/employees
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@warehouse.com",
  "phoneNumber": "+976-12345678",
  "password": "password123",
  "roleName": "SalesAgent"
}
```

#### Get All Employees

```http
GET /api/employees?page=1&limit=10
```

#### Get Employee by ID

```http
GET /api/employees/:id
```

#### Update Employee

```http
PUT /api/employees/:id
Content-Type: application/json

{
  "name": "John Doe Updated",
  "roleName": "Manager",
  "isActive": true
}
```

#### Delete (Deactivate) Employee

```http
DELETE /api/employees/:id
```

### Products Module

#### Create Product (Manager/Admin)

```http
POST /api/products
Content-Type: application/json

{
  "nameMongolian": "Цай",
  "nameEnglish": "Tea",
  "productCode": "PROD-004",
  "supplierId": 1,
  "stockQuantity": 100,
  "priceWholesale": 1200,
  "priceRetail": 1500
}
```

#### Get All Products (All Authenticated Users)

```http
GET /api/products?page=1&limit=10&search=tea
```

#### Get Product by ID

```http
GET /api/products/:id
```

#### Update Product (Manager/Admin)

```http
PUT /api/products/:id
```

#### Adjust Inventory (Manager/Admin)

```http
POST /api/products/inventory/adjust
Content-Type: application/json

{
  "productId": 1,
  "adjustment": 50,
  "reason": "Stock replenishment"
}
```

### Customers Module

#### Create Customer (Manager/Admin)

```http
POST /api/customers
Content-Type: application/json

{
  "name": "ABC Store",
  "address": "Ulaanbaatar, Mongolia",
  "phoneNumber": "+976-99887766",
  "locationLatitude": 47.918869,
  "locationLongitude": 106.917580,
  "customerTypeId": 1,
  "assignedAgentId": 3
}
```

#### Get All Customers

- **SalesAgent**: Can only see their assigned customers
- **Manager/Admin**: Can see all customers

```http
GET /api/customers?page=1&limit=10
```

#### Get Customer by ID

```http
GET /api/customers/:id
```

#### Update Customer (Manager/Admin)

```http
PUT /api/customers/:id
```

### Orders Module

#### Create Order (All Authenticated Users)

```http
POST /api/orders
Content-Type: application/json

{
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
}
```

**Note**: This endpoint automatically:

- Validates stock availability
- Calculates total amount
- Decrements product stock
- Creates order and order items in a transaction

#### Get All Orders

- **SalesAgent**: Can only see their own orders
- **Manager/Admin**: Can see all orders

```http
GET /api/orders?page=1&limit=10&status=Pending&customerId=1
```

#### Get Order by ID

```http
GET /api/orders/:id
```

#### Update Order Status (Manager/Admin)

```http
PUT /api/orders/:id/status
Content-Type: application/json

{
  "status": "Fulfilled"
}
```

**Status Options**: `Pending`, `Fulfilled`, `Cancelled`

### Returns Module (Manager/Admin Only)

#### Create Return

```http
POST /api/returns
Content-Type: application/json

{
  "orderId": 1,
  "productId": 1,
  "quantity": 2,
  "reason": "Damaged goods"
}
```

**Note**: This endpoint automatically increments product stock in a transaction.

#### Get All Returns

```http
GET /api/returns?page=1&limit=10
```

#### Get Return by ID

```http
GET /api/returns/:id
```

### Geolocation Module

#### Record Agent Location

- **SalesAgent**: Can only record their own location
- **Manager/Admin**: Can record any agent's location

```http
POST /api/agents/:id/location
Content-Type: application/json

{
  "latitude": 47.918869,
  "longitude": 106.917580
}
```

#### Get Agent Route (Manager/Admin)

```http
GET /api/agents/:id/route?startDate=2025-01-01&endDate=2025-01-31
```

#### Get All Agent Locations (Manager/Admin)

```http
GET /api/agents/locations/all?date=2025-01-15
```

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication with expiration
2. **Password Hashing**: bcrypt for secure password storage
3. **Role-Based Access Control**: Fine-grained permissions
4. **Rate Limiting**:
   - Login endpoint: 5 attempts per 15 minutes
   - General API: 100 requests per 15 minutes
5. **Input Validation**: Comprehensive validation using express-validator
6. **CORS**: Configurable allowed origins
7. **SQL Injection Protection**: Prisma ORM with parameterized queries
8. **Error Handling**: Global error handler with safe error messages

## 📊 Database Schema

The database includes the following tables:

- `roles`: User roles (Admin, Manager, SalesAgent)
- `employees`: User accounts and authentication
- `suppliers`: Product suppliers
- `products`: Product catalog with inventory
- `customer_types`: Customer classification (Retail, Wholesale)
- `customers`: Customer information
- `orders`: Sales orders
- `order_items`: Order line items
- `returns`: Product returns
- `agent_locations`: GPS tracking for sales agents

## 🐛 Error Handling

All API responses follow a consistent format:

**Success Response:**

```json
{
  "status": "success",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "status": "error",
  "message": "Descriptive error message",
  "errors": [ ... ] // For validation errors
}
```

**HTTP Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## 📝 Logging

Logs are stored in the `logs/` directory:

- `error.log`: Error-level logs
- `combined.log`: All logs

In development mode, logs are also output to the console with color coding.

## 🧪 Testing

To test the API, you can use:

- **Postman**: Import the endpoints from this documentation
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension
- **Insomnia**: API testing tool

Example cURL request:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@warehouse.com","password":"admin123"}'

# Get products (with token)
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer <your-token>"
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use ESLint for code linting
3. Write descriptive commit messages
4. Add validation for all input data
5. Include error handling in all controllers
6. Update documentation for new endpoints

## 📄 License

MIT

## 👥 Support

For issues or questions, please contact the development team.

---

**Happy Coding! 🚀**
