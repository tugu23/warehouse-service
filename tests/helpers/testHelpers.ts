import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Create test roles in the database
 */
export async function createTestRoles() {
  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: "Manager" },
    update: {},
    create: { name: "Manager" },
  });

  const agentRole = await prisma.role.upsert({
    where: { name: "SalesAgent" },
    update: {},
    create: { name: "SalesAgent" },
  });

  return { adminRole, managerRole, agentRole };
}

/**
 * Create test employees
 */
export async function createTestEmployees(roles: {
  adminRole: any;
  managerRole: any;
  agentRole: any;
}) {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.employee.upsert({
    where: { email: "testadmin@test.com" },
    update: {
      name: "Test Admin",
      phoneNumber: "+976-11111111",
      passwordHash,
      roleId: roles.adminRole.id,
      isActive: true,
    },
    create: {
      name: "Test Admin",
      email: "testadmin@test.com",
      phoneNumber: "+976-11111111",
      passwordHash,
      roleId: roles.adminRole.id,
      isActive: true,
    },
  });

  const manager = await prisma.employee.upsert({
    where: { email: "testmanager@test.com" },
    update: {
      name: "Test Manager",
      phoneNumber: "+976-22222222",
      passwordHash,
      roleId: roles.managerRole.id,
      isActive: true,
    },
    create: {
      name: "Test Manager",
      email: "testmanager@test.com",
      phoneNumber: "+976-22222222",
      passwordHash,
      roleId: roles.managerRole.id,
      isActive: true,
    },
  });

  const agent = await prisma.employee.upsert({
    where: { email: "testagent@test.com" },
    update: {
      name: "Test Agent",
      phoneNumber: "+976-33333333",
      passwordHash,
      roleId: roles.agentRole.id,
      isActive: true,
    },
    create: {
      name: "Test Agent",
      email: "testagent@test.com",
      phoneNumber: "+976-33333333",
      passwordHash,
      roleId: roles.agentRole.id,
      isActive: true,
    },
  });

  return { admin, manager, agent };
}

/**
 * Create customer types
 */
export async function createCustomerTypes() {
  const retail = await prisma.customerType.create({
    data: { id: 1, typeName: "Retail" },
  });

  const wholesale = await prisma.customerType.create({
    data: { id: 2, typeName: "Wholesale" },
  });

  return { retail, wholesale };
}

/**
 * Create test supplier
 */
export async function createTestSupplier() {
  return await prisma.supplier.create({
    data: {
      name: "Test Supplier",
      contactInfo: "test@supplier.com",
    },
  });
}

/**
 * Create test products
 */
export async function createTestProducts(supplierId: number) {
  const product1 = await prisma.product.create({
    data: {
      nameMongolian: "Тест бараа 1",
      nameEnglish: "Test Product 1",
      productCode: "TEST-001",
      supplierId,
      stockQuantity: 100,
      priceWholesale: 1000,
      priceRetail: 1500,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      nameMongolian: "Тест бараа 2",
      nameEnglish: "Test Product 2",
      productCode: "TEST-002",
      supplierId,
      stockQuantity: 50,
      priceWholesale: 2000,
      priceRetail: 2500,
    },
  });

  return { product1, product2 };
}

/**
 * Create test customer
 */
export async function createTestCustomer(
  customerTypeId: number,
  agentId?: number
) {
  return await prisma.customer.create({
    data: {
      name: "Test Customer",
      address: "Test Address",
      phoneNumber: "+976-99999999",
      locationLatitude: 47.9186,
      locationLongitude: 106.9177,
      customerTypeId,
      assignedAgentId: agentId,
    },
  });
}

/**
 * Login and get JWT token
 */
export async function loginAndGetToken(
  request: any,
  email: string,
  password: string
) {
  const response = await request
    .post("/api/auth/login")
    .send({ identifier: email, password });

  return response.body.data.token;
}

/**
 * Setup complete test environment
 */
export async function setupTestEnvironment() {
  const roles = await createTestRoles();
  const employees = await createTestEmployees(roles);
  const customerTypes = await createCustomerTypes();
  const supplier = await createTestSupplier();
  const products = await createTestProducts(supplier.id);
  const customer = await createTestCustomer(
    customerTypes.retail.id,
    employees.agent.id
  );

  return {
    roles,
    employees,
    customerTypes,
    supplier,
    products,
    customer,
  };
}

export { prisma };
