import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  const marketSalespersonRole = await prisma.role.upsert({
    where: { name: "MarketSalesperson" },
    update: {},
    create: { name: "MarketSalesperson" },
  });

  const storeSalespersonRole = await prisma.role.upsert({
    where: { name: "StoreSalesperson" },
    update: {},
    create: { name: "StoreSalesperson" },
  });

  console.log("Roles created successfully");

  // Create stores
  console.log("Creating stores...");
  const centralMarket = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Central Wholesale Market",
      address: "Ulaanbaatar, Mongolia",
      storeType: "Market",
      locationLatitude: 47.918869,
      locationLongitude: 106.91758,
      isActive: true,
    },
  });

  const retailStore1 = await prisma.store.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Downtown Retail Store",
      address: "Peace Avenue, Ulaanbaatar",
      storeType: "Store",
      locationLatitude: 47.922178,
      locationLongitude: 106.918556,
      isActive: true,
    },
  });

  console.log("Stores created successfully");

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

  // Create market salesperson
  console.log("Creating market salesperson...");
  const marketSalesPassword = await bcrypt.hash("market123", 10);
  await prisma.employee.upsert({
    where: { email: "market@warehouse.com" },
    update: {},
    create: {
      name: "Market Salesperson",
      email: "market@warehouse.com",
      phoneNumber: "+976-66666666",
      passwordHash: marketSalesPassword,
      roleId: marketSalespersonRole.id,
      storeId: centralMarket.id,
      isActive: true,
    },
  });

  // Create store salesperson
  console.log("Creating store salesperson...");
  const storeSalesPassword = await bcrypt.hash("store123", 10);
  await prisma.employee.upsert({
    where: { email: "store@warehouse.com" },
    update: {},
    create: {
      name: "Store Salesperson",
      email: "store@warehouse.com",
      phoneNumber: "+976-55555555",
      passwordHash: storeSalesPassword,
      roleId: storeSalespersonRole.id,
      storeId: retailStore1.id,
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
        nameKorean: "물",
        productCode: "PROD-001",
        barcode: "8801234567890",
        supplierId: supplier.id,
        categoryId: beverageCategory.id,
        stockQuantity: 100,
        unitsPerBox: 24,
        priceWholesale: 500,
        priceRetail: 700,
        pricePerBox: 12000,
        netWeight: 0.5,
        grossWeight: 0.6,
      },
      {
        nameMongolian: "Сүү",
        nameEnglish: "Milk",
        nameKorean: "우유",
        productCode: "PROD-002",
        barcode: "8801234567891",
        supplierId: supplier.id,
        categoryId: dairyCategory.id,
        stockQuantity: 50,
        unitsPerBox: 12,
        priceWholesale: 1500,
        priceRetail: 2000,
        pricePerBox: 18000,
        netWeight: 1.0,
        grossWeight: 1.1,
      },
      {
        nameMongolian: "Талх",
        nameEnglish: "Bread",
        nameKorean: "빵",
        productCode: "PROD-003",
        barcode: "8801234567892",
        supplierId: supplier.id,
        categoryId: bakeryCategory.id,
        stockQuantity: 75,
        unitsPerBox: 20,
        priceWholesale: 800,
        priceRetail: 1000,
        pricePerBox: 16000,
        netWeight: 0.4,
        grossWeight: 0.45,
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

  console.log(
    "Sample product batches and inventory balances created successfully"
  );

  // Get the sales agent for customer assignment
  const salesAgent = await prisma.employee.findFirst({
    where: { email: "agent@warehouse.com" },
  });

  // Create sample customers
  console.log("Creating sample customers...");
  await prisma.customer.createMany({
    data: [
      {
        name: "Хаан банк дэлгүүр",
        organizationName: "Хаан Банк ХХК",
        organizationType: "Дэлгүүр",
        contactPersonName: "Болд",
        registrationNumber: "1234567890",
        address: "Сүхбаатар дүүрэг, 1-р хороо",
        district: "Сүхбаатар",
        detailedAddress: "Энхтайвны өргөн чөлөө 12",
        phoneNumber: "+976-99001122",
        isVatPayer: true,
        paymentTerms: "Зээл - 30 хоног",
        locationLatitude: 47.9189,
        locationLongitude: 106.9174,
        customerTypeId: wholesaleType.id,
        assignedAgentId: salesAgent?.id,
      },
      {
        name: "Номин дэлгүүр",
        organizationName: "Номин Холдинг ХХК",
        organizationType: "Сүлжээ",
        contactPersonName: "Дорж",
        registrationNumber: "0987654321",
        address: "Чингэлтэй дүүрэг, 5-р хороо",
        district: "Чингэлтэй",
        detailedAddress: "Барилгачдын талбай 1",
        phoneNumber: "+976-88112233",
        isVatPayer: true,
        paymentTerms: "Бэлэн",
        locationLatitude: 47.9242,
        locationLongitude: 106.9208,
        customerTypeId: wholesaleType.id,
        assignedAgentId: salesAgent?.id,
      },
      {
        name: "Хүнсний дэлгүүр",
        organizationName: "Хүнсний дэлгүүр",
        organizationType: "Дэлгүүр",
        contactPersonName: "Сарна",
        registrationNumber: "5555666677",
        address: "Баянзүрх дүүрэг, 3-р хороо",
        district: "Баянзүрх",
        detailedAddress: "16-р хороолол, 35-р байр",
        phoneNumber: "+976-99334455",
        isVatPayer: false,
        paymentTerms: "Бэлэн",
        locationLatitude: 47.9088,
        locationLongitude: 106.9527,
        customerTypeId: retailType.id,
        assignedAgentId: salesAgent?.id,
      },
      {
        name: "Хаан ресторан",
        organizationName: "Хаан Ресторан ХХК",
        organizationType: "Ресторан",
        contactPersonName: "Энхболд",
        registrationNumber: "2222333344",
        address: "Хан-Уул дүүрэг, 2-р хороо",
        district: "Хан-Уул",
        detailedAddress: "Яармагийн зам 7",
        phoneNumber: "+976-77445566",
        isVatPayer: true,
        paymentTerms: "Данс",
        locationLatitude: 47.8897,
        locationLongitude: 106.9319,
        customerTypeId: retailType.id,
        assignedAgentId: salesAgent?.id,
      },
    ],
  });

  console.log("Sample customers created successfully");

  // Create sample delivery plans
  console.log("Creating sample delivery plans...");
  const customers = await prisma.customer.findMany();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    await prisma.deliveryPlan.create({
      data: {
        planDate: tomorrow,
        agentId: salesAgent!.id,
        customerId: customer.id,
        scheduledTime: new Date(tomorrow.getTime() + i * 60 * 60 * 1000), // Each customer 1 hour apart
        status: "Planned",
        description: `${customer.district} дүүргийн хүргэлтийн төлөвлөгөө`,
        targetArea: customer.district || "Улаанбаатар",
        estimatedOrders: Math.floor(Math.random() * 5) + 1,
        deliveryNotes: `Харилцагч: ${customer.name}`,
      },
    });
  }

  console.log("Sample delivery plans created successfully");

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
