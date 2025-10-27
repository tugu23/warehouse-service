import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

// Global test teardown
afterAll(async () => {
  // Disconnect from test database
  await prisma.$disconnect();
});

// Clean database after each test
afterEach(async () => {
  // Delete in order to respect foreign key constraints
  await prisma.agentLocation.deleteMany({});
  await prisma.return.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.customerType.deleteMany({});
});

export { prisma };
