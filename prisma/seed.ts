import prisma from "../src/db/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Starting database seeding...");

  // Create roles
  console.log("Creating roles...");
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

  const salesAgentRole = await prisma.role.upsert({
    where: { name: "SalesAgent" },
    update: {},
    create: { name: "SalesAgent" },
  });

  console.log("Roles created successfully");

  // Create admin user
  console.log("Creating admin user...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.employee.upsert({
    where: { email: "admin@warehouse.com" },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@warehouse.com",
      phoneNumber: "+976-99999999",
      passwordHash: adminPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  // Create manager user
  console.log("Creating manager user...");
  const managerPassword = await bcrypt.hash("manager123", 10);
  await prisma.employee.upsert({
    where: { email: "manager@warehouse.com" },
    update: {},
    create: {
      name: "Warehouse Manager",
      email: "manager@warehouse.com",
      phoneNumber: "+976-88888888",
      passwordHash: managerPassword,
      roleId: managerRole.id,
      isActive: true,
    },
  });

  // Create sales agent user
  console.log("Creating sales agent user...");
  const agentPassword = await bcrypt.hash("agent123", 10);
  await prisma.employee.upsert({
    where: { email: "agent@warehouse.com" },
    update: {},
    create: {
      name: "Sales Agent",
      email: "agent@warehouse.com",
      phoneNumber: "+976-77777777",
      passwordHash: agentPassword,
      roleId: salesAgentRole.id,
      isActive: true,
    },
  });

  console.log("Employees created successfully");

  // Create customer types
  console.log("Creating customer types...");
  const retailType = await prisma.customerType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      typeName: "Retail",
    },
  });

  const wholesaleType = await prisma.customerType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      typeName: "Wholesale",
    },
  });

  console.log("Customer types created successfully");

  // Create a sample supplier
  console.log("Creating sample supplier...");
  const supplier = await prisma.supplier.create({
    data: {
      name: "Sample Supplier Co.",
      contactInfo: "Phone: +976-11111111, Email: supplier@example.com",
    },
  });

  // Create sample products
  console.log("Creating sample products...");
  await prisma.product.createMany({
    data: [
      {
        nameMongolian: "Ус",
        nameEnglish: "Water",
        productCode: "PROD-001",
        supplierId: supplier.id,
        stockQuantity: 100,
        priceWholesale: 500,
        priceRetail: 700,
      },
      {
        nameMongolian: "Сүү",
        nameEnglish: "Milk",
        productCode: "PROD-002",
        supplierId: supplier.id,
        stockQuantity: 50,
        priceWholesale: 1500,
        priceRetail: 2000,
      },
      {
        nameMongolian: "Талх",
        nameEnglish: "Bread",
        productCode: "PROD-003",
        supplierId: supplier.id,
        stockQuantity: 75,
        priceWholesale: 800,
        priceRetail: 1000,
      },
    ],
  });

  console.log("Sample products created successfully");

  console.log("Database seeding completed successfully!");
  console.log("\nDefault users:");
  console.log("Admin: admin@warehouse.com / admin123");
  console.log("Manager: manager@warehouse.com / manager123");
  console.log("Agent: agent@warehouse.com / agent123");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
