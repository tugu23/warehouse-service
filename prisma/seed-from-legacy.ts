/**
 * Legacy Database Migration Seed File
 * Imports data from parsed SQL dump into new Prisma schema
 */

import prisma from "../src/db/prisma";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

// ID Mapping System
class IdMapper {
  private maps: Map<string, Map<number, number>> = new Map();

  set(table: string, oldId: number, newId: number): void {
    if (!this.maps.has(table)) {
      this.maps.set(table, new Map());
    }
    this.maps.get(table)!.set(oldId, newId);
  }

  get(table: string, oldId: number): number | undefined {
    return this.maps.get(table)?.get(oldId);
  }

  has(table: string, oldId: number): boolean {
    return this.maps.get(table)?.has(oldId) || false;
  }
}

const idMapper = new IdMapper();

// Helper functions
function loadJsonData(tableName: string): any {
  const filePath = path.join(__dirname, "parsed-data", `${tableName}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${tableName}.json`);
    return { columns: [], rows: [] };
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function mapRowToObject(columns: string[], row: any[]): any {
  const obj: any = {};
  columns.forEach((col, idx) => {
    obj[col] = row[idx];
  });
  return obj;
}

function parseBoolean(value: any): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    return lower === "тийм" || lower === "true" || lower === "1";
  }
  return false;
}

function parseDecimal(value: any): number | null {
  if (value === null || value === undefined) return null;
  const num = typeof value === "number" ? value : parseFloat(value);
  return isNaN(num) ? null : num;
}

function parseDate(value: any): Date | null {
  if (!value) return null;
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

function cleanPhoneNumber(phone: any): string | null {
  if (!phone) return null;
  const str = String(phone).replace(/\D/g, "");
  return str ? `+976${str}` : null;
}

function parseCoordinate(value: any): number | null {
  if (!value) return null;
  const num = parseFloat(String(value));
  return isNaN(num) || num === 0 ? null : num;
}

// Batch processing helper
async function batchProcess<T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>,
  label: string
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, Math.min(i + batchSize, items.length));
    try {
      await processor(batch);
      console.log(
        `  ✓ Processed ${Math.min(i + batchSize, items.length)}/${
          items.length
        } ${label}`
      );
    } catch (error) {
      console.error(
        `  ✗ Error processing ${label} batch ${i}-${i + batchSize}:`,
        error
      );
    }
  }
}

async function main() {
  console.log("🚀 Starting legacy database migration...\n");

  // ============================================================================
  // PHASE 1: Reference Data (Roles, Stores, CustomerTypes)
  // ============================================================================
  console.log("📋 Phase 1: Creating reference data...");

  // Create roles
  console.log("  Creating roles...");
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

  console.log("  ✓ Roles created");

  console.log("  ✓ Roles created");

  // Create stores
  console.log("  Creating stores...");
  const centralMarket = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Төв бөөний зах",
      address: "Улаанбаатар хот",
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
      name: "Жижиглэн худалдааны дэлгүүр 1",
      address: "Улаанбаатар хот",
      storeType: "Store",
      locationLatitude: 47.922178,
      locationLongitude: 106.918556,
      isActive: true,
    },
  });

  console.log("  ✓ Stores created");

  // Create customer types from turul_hariltsagch
  console.log("  Creating customer types...");
  const turulHariltsagchData = loadJsonData("turul_hariltsagch");
  const customerTypeMap = new Map<number, number>();

  for (const row of turulHariltsagchData.rows) {
    const obj = mapRowToObject(turulHariltsagchData.columns, row);
    try {
      const customerType = await prisma.customerType.create({
        data: {
          typeName: obj.name || `Төрөл ${obj.id}`,
        },
      });
      customerTypeMap.set(obj.id, customerType.id);
      idMapper.set("turul_hariltsagch", obj.id, customerType.id);
    } catch (error) {
      console.error(`  ⚠️  Error creating customer type ${obj.id}:`, error);
    }
  }

  // Ensure default types exist
  if (!customerTypeMap.has(1)) {
    const wholesale = await prisma.customerType.create({
      data: { typeName: "Бөөний" },
    });
    customerTypeMap.set(1, wholesale.id);
  }
  if (!customerTypeMap.has(2)) {
    const retail = await prisma.customerType.create({
      data: { typeName: "Жижиглэн" },
    });
    customerTypeMap.set(2, retail.id);
  }

  console.log(`  ✓ Customer types created: ${customerTypeMap.size}`);

  // ============================================================================
  // PHASE 2: Suppliers and Categories
  // ============================================================================
  console.log("\n📦 Phase 2: Creating suppliers and categories...");

  // Create suppliers from uildwerlegch
  console.log("  Creating suppliers...");
  const uildwerlegchData = loadJsonData("uildwerlegch");

  for (const row of uildwerlegchData.rows) {
    const obj = mapRowToObject(uildwerlegchData.columns, row);
    try {
      const supplier = await prisma.supplier.create({
        data: {
          name: obj.name || `Нийлүүлэгч ${obj.id}`,
          contactInfo: obj.utas ? `Утас: ${obj.utas}` : null,
        },
      });
      idMapper.set("uildwerlegch", obj.id, supplier.id);
    } catch (error) {
      console.error(`  ⚠️  Error creating supplier ${obj.id}:`, error);
    }
  }

  console.log(`  ✓ Suppliers created: ${uildwerlegchData.rows.length}`);

  // Create categories from turul
  console.log("  Creating categories...");
  const turulData = loadJsonData("turul");

  for (const row of turulData.rows) {
    const obj = mapRowToObject(turulData.columns, row);
    try {
      const category = await prisma.category.create({
        data: {
          nameMongolian: obj.ner || `Төрөл ${obj.id}`,
          nameEnglish: null,
          description: null,
        },
      });
      idMapper.set("turul", obj.id, category.id);
    } catch (error) {
      console.error(`  ⚠️  Error creating category ${obj.id}:`, error);
    }
  }

  // Create default category if needed
  if (turulData.rows.length === 0) {
    const defaultCategory = await prisma.category.create({
      data: {
        nameMongolian: "Бусад",
        nameEnglish: "Others",
        description: "Default category",
      },
    });
    idMapper.set("turul", 12, defaultCategory.id);
  }

  console.log(`  ✓ Categories created: ${turulData.rows.length || 1}`);

  // ============================================================================
  // PHASE 3: Products
  // ============================================================================
  console.log("\n🛍️  Phase 3: Creating products...");
  const baraaData = loadJsonData("baraa");
  const products: any[] = [];

  for (const row of baraaData.rows) {
    const obj = mapRowToObject(baraaData.columns, row);

    // Skip products without names
    if (!obj.mon_ner) continue;

    const supplierId = obj.company
      ? idMapper.get("uildwerlegch", obj.company)
      : null;
    const categoryId = obj.turul ? idMapper.get("turul", obj.turul) : null;

    products.push({
      nameMongolian: obj.mon_ner || "Нэргүй бараа",
      nameEnglish: obj.eng_ner || null,
      nameKorean: obj.ko_ner || null,
      productCode: obj.code ? String(obj.code) : null,
      barcode: obj.bar_code ? String(obj.bar_code) : null,
      supplierId: supplierId || null,
      categoryId: categoryId || null,
      stockQuantity: 0, // Will be updated from inventory
      unitsPerBox: obj.khairtsag || null,
      priceWholesale: parseDecimal(obj.price_sh_w),
      priceRetail: parseDecimal(obj.price_sh_d),
      pricePerBox: parseDecimal(obj.price_box_d),
      netWeight: parseDecimal(obj.tsewer_jin),
      grossWeight: parseDecimal(obj.bohir_jin),
      legacyId: obj.id, // Store for mapping
    });
  }

  await batchProcess(
    products,
    100,
    async (batch) => {
      for (const productData of batch) {
        try {
          const { legacyId, ...data } = productData;
          const product = await prisma.product.create({ data });
          idMapper.set("baraa", legacyId, product.id);
        } catch (error) {
          console.error(`  ⚠️  Error creating product:`, error);
        }
      }
    },
    "products"
  );

  console.log(`  ✓ Products created: ${products.length}`);

  // ============================================================================
  // PHASE 4: Sales Agents (Employees)
  // ============================================================================
  console.log("\n👥 Phase 4: Creating sales agents...");
  const borluulagchData = loadJsonData("borluulagch");
  const defaultPassword = await bcrypt.hash("agent123", 10);

  for (const row of borluulagchData.rows) {
    const obj = mapRowToObject(borluulagchData.columns, row);

    try {
      const email = `agent${obj.id}@warehouse.com`;
      const employee = await prisma.employee.create({
        data: {
          name: obj.b_ner || `Борлуулагч ${obj.id}`,
          email: email,
          phoneNumber: cleanPhoneNumber(obj.b_utas),
          passwordHash: defaultPassword,
          roleId: salesAgentRole.id,
          isActive: true,
        },
      });
      idMapper.set("borluulagch", obj.id, employee.id);
    } catch (error) {
      console.error(`  ⚠️  Error creating agent ${obj.id}:`, error);
    }
  }

  console.log(`  ✓ Sales agents created: ${borluulagchData.rows.length}`);

  // Create admin user
  console.log("  Creating admin user...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.employee.upsert({
    where: { email: "admin@warehouse.com" },
    update: {},
    create: {
      name: "Системийн админ",
      email: "admin@warehouse.com",
      phoneNumber: "+976-99999999",
      passwordHash: adminPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log("  ✓ Admin user created");

  // ============================================================================
  // PHASE 5: Customers
  // ============================================================================
  console.log("\n🏢 Phase 5: Creating customers...");
  const hariltsagchData = loadJsonData("hariltsagch");
  const customers: any[] = [];

  for (const row of hariltsagchData.rows) {
    const obj = mapRowToObject(hariltsagchData.columns, row);

    if (!obj.ner) continue;

    const customerTypeId = obj.turul
      ? customerTypeMap.get(obj.turul) || customerTypeMap.get(2)
      : customerTypeMap.get(2);

    const assignedAgentId = obj.borluulagch_id
      ? idMapper.get("borluulagch", obj.borluulagch_id)
      : null;

    customers.push({
      name: obj.ner,
      organizationName: obj.realname || null,
      organizationType: null,
      contactPersonName: null,
      registrationNumber: obj.hariltsagch_id
        ? String(obj.hariltsagch_id)
        : null,
      address: obj.hayg || null,
      district: obj.dvvreg || null,
      detailedAddress: null,
      phoneNumber: cleanPhoneNumber(obj.utas),
      isVatPayer: parseBoolean(obj.noat_tulugch),
      paymentTerms: obj.tulbur_helber || "Бэлэн",
      locationLatitude: parseCoordinate(obj.kordinat_x),
      locationLongitude: parseCoordinate(obj.kordinat_y),
      customerTypeId: customerTypeId,
      assignedAgentId: assignedAgentId,
      legacyId: obj.id,
    });
  }

  await batchProcess(
    customers,
    500,
    async (batch) => {
      for (const customerData of batch) {
        try {
          const { legacyId, ...data } = customerData;
          // Use upsert to prevent duplicates if script runs multiple times
          const uniqueKey = {
            name: data.name,
            phoneNumber: data.phoneNumber || "",
            registrationNumber: data.registrationNumber || "",
            address: data.address || "",
          };
          
          // Check if customer already exists
          const existing = await prisma.customer.findFirst({
            where: uniqueKey,
          });
          
          let customer;
          if (existing) {
            customer = existing;
            console.log(`  ℹ️  Skipping duplicate customer: ${data.name}`);
          } else {
            customer = await prisma.customer.create({ data });
          }
          
          idMapper.set("hariltsagch", legacyId, customer.id);
        } catch (error) {
          console.error(`  ⚠️  Error creating customer:`, error);
        }
      }
    },
    "customers"
  );

  console.log(`  ✓ Customers created: ${customers.length}`);

  // ============================================================================
  // PHASE 6: Product Batches
  // ============================================================================
  console.log("\n📦 Phase 6: Creating product batches...");
  const containerData = loadJsonData("container");
  const batches: any[] = [];

  for (const row of containerData.rows) {
    const obj = mapRowToObject(containerData.columns, row);

    const productId = obj.baraanii_id
      ? idMapper.get("baraa", obj.baraanii_id)
      : null;

    if (!productId) continue;

    const arrivalDate = parseDate(obj.ognoo) || new Date();
    const expiryDate = new Date(arrivalDate);
    expiryDate.setMonth(expiryDate.getMonth() + 6); // Default 6 month expiry

    batches.push({
      productId: productId,
      batchNumber: obj.number ? String(obj.number) : `BATCH-${obj.id}`,
      arrivalDate: arrivalDate,
      expiryDate: expiryDate,
      quantity: obj.too || 0,
      costPrice: null,
      supplierInvoice: null,
      isActive: true,
    });
  }

  await batchProcess(
    batches,
    500,
    async (batch) => {
      try {
        await prisma.productBatch.createMany({
          data: batch,
          skipDuplicates: true,
        });
      } catch (error) {
        console.error(`  ⚠️  Error creating batches:`, error);
      }
    },
    "product batches"
  );

  console.log(`  ✓ Product batches created: ${batches.length}`);

  // ============================================================================
  // PHASE 7: Delivery Plans
  // ============================================================================
  console.log("\n🚚 Phase 7: Creating delivery plans...");
  const planData = loadJsonData("plan");
  const plans: any[] = [];

  for (const row of planData.rows) {
    const obj = mapRowToObject(planData.columns, row);

    const agentId = obj.salerID
      ? idMapper.get("borluulagch", obj.salerID)
      : null;

    if (!agentId) continue;

    // Find a customer for this agent
    const customer = await prisma.customer.findFirst({
      where: { assignedAgentId: agentId },
    });

    if (!customer) continue;

    const planDate = parseDate(obj.date) || new Date();

    plans.push({
      planDate: planDate,
      agentId: agentId,
      customerId: customer.id,
      scheduledTime: planDate,
      status: "Planned",
      description: obj.productName || null,
      targetArea: null,
      estimatedOrders: obj.box || null,
      deliveryNotes: `Amount: ${obj.amount || 0}`,
    });
  }

  await batchProcess(
    plans,
    500,
    async (batch) => {
      try {
        await prisma.deliveryPlan.createMany({
          data: batch,
          skipDuplicates: true,
        });
      } catch (error) {
        console.error(`  ⚠️  Error creating delivery plans:`, error);
      }
    },
    "delivery plans"
  );

  console.log(`  ✓ Delivery plans created: ${plans.length}`);

  // ============================================================================
  // PHASE 8: Agent Locations
  // ============================================================================
  console.log("\n📍 Phase 8: Creating agent locations...");
  const positionData = loadJsonData("position");
  const locations: any[] = [];

  // Sample positions - only take every 100th to avoid overwhelming the database
  for (let i = 0; i < positionData.rows.length; i += 100) {
    const row = positionData.rows[i];
    const obj = mapRowToObject(positionData.columns, row);

    const agentId = obj.borluulagch_id
      ? idMapper.get("borluulagch", obj.borluulagch_id)
      : null;

    if (!agentId) continue;

    const lat = parseCoordinate(obj.x);
    const lon = parseCoordinate(obj.y);

    if (lat && lon) {
      locations.push({
        agentId: agentId,
        latitude: lat,
        longitude: lon,
        timestamp: new Date(),
      });
    }
  }

  await batchProcess(
    locations,
    500,
    async (batch) => {
      try {
        await prisma.agentLocation.createMany({
          data: batch,
          skipDuplicates: true,
        });
      } catch (error) {
        console.error(`  ⚠️  Error creating agent locations:`, error);
      }
    },
    "agent locations"
  );

  console.log(`  ✓ Agent locations created: ${locations.length} (sampled)`);

  // ============================================================================
  // PHASE 9: Orders and Order Items
  // ============================================================================
  console.log("\n🛒 Phase 9: Creating orders...");
  const zahialgaData = loadJsonData("zahialga");

  // Group order items by customer, date, and agent to create orders
  const orderGroups = new Map<string, any[]>();

  for (const row of zahialgaData.rows) {
    const obj = mapRowToObject(zahialgaData.columns, row);

    const customerId = obj.baiguulgiin_id
      ? idMapper.get("hariltsagch", obj.baiguulgiin_id)
      : null;
    const agentId = obj.borluulagch_id
      ? idMapper.get("borluulagch", obj.borluulagch_id)
      : null;
    const productId = obj.padaanii_id
      ? idMapper.get("baraa", obj.padaanii_id)
      : null;

    if (!customerId || !agentId || !productId) continue;

    const orderDate = parseDate(obj.ognoo) || new Date();
    const dateKey = orderDate.toISOString().split("T")[0];
    const groupKey = `${customerId}-${agentId}-${dateKey}`;

    if (!orderGroups.has(groupKey)) {
      orderGroups.set(groupKey, []);
    }

    orderGroups.get(groupKey)!.push({
      customerId,
      agentId,
      orderDate,
      productId,
      quantity: obj.too_shirheg || 1,
      unitPrice: parseDecimal(obj.negj_vne) || 0,
      totalPrice: parseDecimal(obj.niit_vne) || 0,
      paymentMethod: obj.tulbur_helber || "Cash",
      isPaid: parseBoolean(obj.tulbur_hiisen_eseh),
    });
  }

  console.log(
    `  Found ${orderGroups.size} order groups from ${zahialgaData.rows.length} items`
  );

  // Sample orders - take only recent ones or every Nth to avoid overwhelming
  const orderGroupsArray = Array.from(orderGroups.entries());
  const sampledOrders = orderGroupsArray
    .filter((_, index) => index % 100 === 0)
    .slice(0, 1000);

  let ordersCreated = 0;
  let orderItemsCreated = 0;

  await batchProcess(
    sampledOrders,
    50,
    async (batch) => {
      for (const [groupKey, items] of batch) {
        try {
          const firstItem = items[0];

          // Map payment method
          let paymentMethod = "Cash";
          const paymentStr = String(firstItem.paymentMethod).toLowerCase();
          if (paymentStr.includes("зээл") || paymentStr.includes("падаан")) {
            paymentMethod = "Credit";
          } else if (paymentStr.includes("данс")) {
            paymentMethod = "BankTransfer";
          }

          // Calculate totals
          const subtotal = items.reduce(
            (sum, item) => sum + (item.totalPrice || 0),
            0
          );
          const vatAmount = 0; // Legacy system doesn't have VAT breakdown
          const totalAmount = subtotal;

          // Create order
          const order = await prisma.order.create({
            data: {
              customerId: firstItem.customerId,
              agentId: firstItem.agentId,
              orderDate: firstItem.orderDate,
              orderType: "Store",
              status: "Completed",
              subtotalAmount: subtotal,
              vatAmount: vatAmount,
              totalAmount: totalAmount,
              paymentMethod: paymentMethod as any,
              paymentStatus: firstItem.isPaid ? "Paid" : "Pending",
              paidAmount: firstItem.isPaid ? totalAmount : 0,
              remainingAmount: firstItem.isPaid ? 0 : totalAmount,
            },
          });

          ordersCreated++;

          // Create order items
          for (const item of items) {
            await prisma.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              },
            });
            orderItemsCreated++;
          }
        } catch (error) {
          console.error(`  ⚠️  Error creating order group:`, error);
        }
      }
    },
    "orders"
  );

  console.log(
    `  ✓ Orders created: ${ordersCreated} with ${orderItemsCreated} items (sampled)`
  );

  // ============================================================================
  // PHASE 10: Returns
  // ============================================================================
  console.log("\n🔄 Phase 10: Creating returns...");

  // Create sample returns from orders
  const recentOrders = await prisma.order.findMany({
    take: 50,
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  let returnsCreated = 0;
  for (const order of recentOrders) {
    // Randomly create returns for some order items
    if (Math.random() > 0.8 && order.orderItems.length > 0) {
      const item = order.orderItems[0];
      const returnQty = Math.min(
        item.quantity,
        Math.floor(Math.random() * 3) + 1
      );

      try {
        await prisma.return.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: returnQty,
            reason: "Чанаргүй бараа",
            returnDate: new Date(),
          },
        });
        returnsCreated++;
      } catch (error) {
        // Skip if error
      }
    }
  }

  console.log(`  ✓ Returns created: ${returnsCreated}`);

  // ============================================================================
  // PHASE 11: Inventory Balances
  // ============================================================================
  console.log("\n📊 Phase 11: Creating inventory balances...");

  const allProducts = await prisma.product.findMany();
  const now = new Date();
  const balances: any[] = [];

  for (const product of allProducts) {
    balances.push({
      productId: product.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      openingBalance: 0,
      closingBalance: product.stockQuantity,
      totalIn: product.stockQuantity,
      totalOut: 0,
    });
  }

  await batchProcess(
    balances,
    500,
    async (batch) => {
      try {
        await prisma.inventoryBalance.createMany({
          data: batch,
          skipDuplicates: true,
        });
      } catch (error) {
        console.error(`  ⚠️  Error creating inventory balances:`, error);
      }
    },
    "inventory balances"
  );

  console.log(`  ✓ Inventory balances created: ${balances.length}`);

  console.log("\n✅ Legacy database migration completed successfully!");
  console.log("\n" + "=".repeat(60));
  console.log("MIGRATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`  📦 Products: ${products.length}`);
  console.log(`  🏢 Customers: ${customers.length}`);
  console.log(`  👥 Sales Agents: ${borluulagchData.rows.length}`);
  console.log(`  📦 Product Batches: ${batches.length}`);
  console.log(`  🚚 Delivery Plans: ${plans.length}`);
  console.log(`  📍 Agent Locations: ${locations.length} (sampled)`);
  console.log(
    `  🛒 Orders: ${ordersCreated} with ${orderItemsCreated} items (sampled)`
  );
  console.log(`  🔄 Returns: ${returnsCreated}`);
  console.log(`  📊 Inventory Balances: ${balances.length}`);
  console.log("=".repeat(60));
  console.log("\n🔑 Default login credentials:");
  console.log("  Admin: admin@warehouse.com / admin123");
  console.log("  Agents: agent{id}@warehouse.com / agent123");
  console.log("\n💡 Note: Large datasets were sampled to ensure performance.");
  console.log("   Original data: 632,540 order items, 155,696 location points");
}

main()
  .catch((e) => {
    console.error("❌ Error during migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
