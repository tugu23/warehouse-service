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

  // Create sample categories
  console.log("Creating sample categories...");
  const beverageCategory = await prisma.category.create({
    data: {
      nameMongolian: "Ундаа",
      nameEnglish: "Beverages",
      description: "All types of beverages and drinks",
    },
  });

  const dairyCategory = await prisma.category.create({
    data: {
      nameMongolian: "Сүүн бүтээгдэхүүн",
      nameEnglish: "Dairy Products",
      description: "Milk and dairy-based products",
    },
  });

  const bakeryCategory = await prisma.category.create({
    data: {
      nameMongolian: "Нарийн боов",
      nameEnglish: "Bakery Products",
      description: "Bread and bakery items",
    },
  });

  console.log("Sample categories created successfully");

  // Create sample products
  console.log("Creating sample products...");
  await prisma.product.createMany({
    data: [
      {
        nameMongolian: "Ус",
        nameEnglish: "Water",
        productCode: "PROD-001",
        supplierId: supplier.id,
        categoryId: beverageCategory.id,
        stockQuantity: 100,
        priceWholesale: 500,
        priceRetail: 700,
      },
      {
        nameMongolian: "Сүү",
        nameEnglish: "Milk",
        productCode: "PROD-002",
        supplierId: supplier.id,
        categoryId: dairyCategory.id,
        stockQuantity: 50,
        priceWholesale: 1500,
        priceRetail: 2000,
      },
      {
        nameMongolian: "Талх",
        nameEnglish: "Bread",
        productCode: "PROD-003",
        supplierId: supplier.id,
        categoryId: bakeryCategory.id,
        stockQuantity: 75,
        priceWholesale: 800,
        priceRetail: 1000,
      },
    ],
  });

  console.log("Sample products created successfully");

  // Get created products for batches
  const products = await prisma.product.findMany();

  // Create sample product batches with expiry dates
  console.log("Creating sample product batches...");
  const now = new Date();
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 6);

  for (const product of products) {
    await prisma.productBatch.create({
      data: {
        productId: product.id,
        batchNumber: `BATCH-${product.productCode}-001`,
        arrivalDate: now,
        expiryDate: futureDate,
        quantity: Math.floor(product.stockQuantity / 2),
        costPrice: product.priceWholesale || product.priceRetail,
        supplierInvoice: `INV-${product.productCode}-2024-001`,
        isActive: true,
      },
    });

    await prisma.productBatch.create({
      data: {
        productId: product.id,
        batchNumber: `BATCH-${product.productCode}-002`,
        arrivalDate: now,
        expiryDate: new Date(futureDate.getTime() + 30 * 24 * 60 * 60 * 1000), // +1 month from first batch
        quantity: Math.floor(product.stockQuantity / 2),
        costPrice: product.priceWholesale || product.priceRetail,
        supplierInvoice: `INV-${product.productCode}-2024-002`,
        isActive: true,
      },
    });

    // Create inventory balance for current month
    await prisma.inventoryBalance.create({
      data: {
        productId: product.id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        openingBalance: 0,
        closingBalance: product.stockQuantity,
        totalIn: product.stockQuantity,
        totalOut: 0,
      },
    });
  }

  console.log("Sample product batches and inventory balances created successfully");

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
