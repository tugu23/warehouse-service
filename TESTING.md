# Testing Guide

This document explains how to run and maintain the automated test suite for the Warehouse Management System API.

## Overview

The project uses **Jest** as the testing framework and **Supertest** for API endpoint testing. All tests are written in TypeScript.

## Test Structure

```
tests/
├── setup.ts                    # Global test setup and teardown
├── helpers/
│   └── testHelpers.ts         # Test utilities and helper functions
└── integration/
    ├── auth.test.ts           # Authentication endpoint tests
    ├── employees.test.ts      # Employee management tests
    ├── products.test.ts       # Product and inventory tests
    ├── customers.test.ts      # Customer management tests
    ├── orders.test.ts         # Order processing tests
    ├── returns.test.ts        # Product return tests
    └── agents.test.ts         # Agent geolocation tests
```

## Running Tests

### Local Development

1. **Ensure the database is running:**

   ```bash
   # Using Docker/Podman
   podman-compose -f docker-compose.dev.yml up -d postgres-dev
   ```

2. **Run all tests:**

   ```bash
   npm test
   ```

3. **Run tests in watch mode:**

   ```bash
   npm run test:watch
   ```

4. **Run specific test file:**

   ```bash
   npm test -- auth.test.ts
   ```

5. **Run tests with coverage:**
   ```bash
   npm test -- --coverage
   ```

### In Docker Container

```bash
# Run tests inside the dev container
podman-compose -f docker-compose.dev.yml exec backend-dev npm test
```

### CI/CD

```bash
npm run test:ci
```

## Test Coverage

The test suite covers:

### Authentication (auth.test.ts)

- ✅ Successful login with valid credentials
- ✅ Invalid credentials handling
- ✅ Input validation (email format, required fields)
- ✅ JWT token generation

### Employees (employees.test.ts - 15+ tests)

- ✅ Create, read, update, delete operations
- ✅ Admin-only access control
- ✅ Role-based permissions
- ✅ Input validation
- ✅ Email uniqueness
- ✅ Employee activation/deactivation

### Products (products.test.ts - 17+ tests)

- ✅ Product CRUD operations
- ✅ Inventory adjustments
- ✅ Admin/Manager access control
- ✅ Agent read-only access
- ✅ Stock quantity validation
- ✅ Price updates

### Customers (customers.test.ts - 12+ tests)

- ✅ Customer CRUD operations
- ✅ Geolocation data storage
- ✅ Agent assignment
- ✅ Role-based data filtering (agents see only their customers)
- ✅ Customer type management

### Orders (orders.test.ts - 15+ tests)

- ✅ Order creation with multiple items
- ✅ Total amount calculation
- ✅ Stock quantity reduction
- ✅ Order status updates (Pending, Fulfilled, Cancelled)
- ✅ Role-based access (agents can create, only admin/manager can update status)
- ✅ Order item validation

### Returns (returns.test.ts - 12+ tests)

- ✅ Product return processing
- ✅ Stock restoration on returns
- ✅ Return reason tracking
- ✅ Admin/Manager-only access
- ✅ Return validation

### Agents (agents.test.ts - 16+ tests)

- ✅ GPS location recording
- ✅ Agent route history
- ✅ All agents location tracking
- ✅ Date range filtering
- ✅ Agent self-recording permissions
- ✅ Admin/Manager route access

**Total: 100+ test cases**

## Test Database

- Tests use the same database connection as the development environment
- Each test cleans up after itself using `afterEach` hooks
- Database is reset between test suites
- Foreign key constraints are respected during cleanup

## Test Helpers

### setupTestEnvironment()

Creates a complete test environment with:

- Roles (Admin, Manager, SalesAgent)
- Test employees (one for each role)
- Customer types (Retail, Wholesale)
- Test supplier
- Test products
- Test customer

### loginAndGetToken(request, email, password)

Helper function to login and retrieve JWT token for authenticated requests.

### Other Utilities

- `createTestRoles()` - Create role records
- `createTestEmployees()` - Create test users
- `createTestProducts()` - Create test inventory
- `createTestCustomer()` - Create test customer

## Writing New Tests

### Example Test Structure

```typescript
import request from "supertest";
import app from "../../src/app";
import { setupTestEnvironment, loginAndGetToken } from "../helpers/testHelpers";

describe("Your API Endpoint", () => {
  let adminToken: string;
  let testData: any;

  beforeEach(async () => {
    testData = await setupTestEnvironment();
    adminToken = await loginAndGetToken(
      request(app),
      "testadmin@test.com",
      "password123"
    );
  });

  it("should do something", async () => {
    const response = await request(app)
      .post("/api/your-endpoint")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ data: "test" })
      .expect(200);

    expect(response.body.status).toBe("success");
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use `afterEach` for cleanup
3. **Descriptive Names**: Use clear test descriptions
4. **Assertions**: Test both success and error cases
5. **Coverage**: Aim for >80% code coverage
6. **Performance**: Keep tests fast (<30s total)

## Continuous Integration

Tests are automatically run in CI/CD pipelines. Ensure all tests pass before merging:

```bash
# Run tests as CI would
npm run test:ci
```

## Troubleshooting

### Database Connection Issues

```bash
# Ensure database is running
podman-compose -f docker-compose.dev.yml ps

# Check database logs
podman logs warehouse-db-dev
```

### Test Timeouts

- Increase timeout in `jest.config.js` if needed
- Default is 30 seconds per test

### Failed Tests

```bash
# Run with verbose output
npm test -- --verbose

# Run specific failing test
npm test -- -t "test name pattern"
```

## Code Coverage

View coverage reports:

```bash
npm test -- --coverage

# Open HTML report
open coverage/lcov-report/index.html
```

## Performance

Expected test execution times:

- Authentication: ~2s
- Employees: ~5s
- Products: ~6s
- Customers: ~4s
- Orders: ~6s
- Returns: ~5s
- Agents: ~6s

**Total: ~30-40 seconds**

## Next Steps

- Add integration tests for complex workflows
- Add performance/load tests
- Add E2E tests for critical user journeys
- Set up test coverage requirements in CI/CD
- Add mutation testing for better coverage quality
