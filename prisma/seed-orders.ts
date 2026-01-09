/**
 * Legacy Orders Seed Script
 * Seeds orders from zahialga.json - run separately as it takes a long time
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

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
        `  ✓ Processed ${Math.min(i + batchSize, items.length)}/${items.length} ${label}`
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
  console.log("🛒 Starting orders seed from legacy data...\n");

  // Build product ID map (legacy ID -> current ID)
  console.log("📦 Building product mappings...");
  const baraaData = loadJsonData("baraa");
  const productIdMap = new Map<number, number>();
  
  for (const row of baraaData.rows) {
    const obj = mapRowToObject(baraaData.columns, row);
    // Check if product exists in database
    const product = await prisma.product.findUnique({
      where: { id: obj.id },
      select: { id: true },
    });
    if (product) {
      productIdMap.set(obj.id, product.id);
    }
  }
  console.log(`  ✓ Found ${productIdMap.size} products in database`);

  // Build customer ID map (legacy ID -> current ID)
  console.log("🏢 Building customer mappings...");
  const hariltsagchData = loadJsonData("hariltsagch");
  const customerIdMap = new Map<number, number>();
  
  for (const row of hariltsagchData.rows) {
    const obj = mapRowToObject(hariltsagchData.columns, row);
    // Find customer by name (since we don't have legacy ID stored)
    const customer = await prisma.customer.findFirst({
      where: { name: obj.ner },
      select: { id: true },
    });
    if (customer) {
      customerIdMap.set(obj.id, customer.id);
    }
  }
  console.log(`  ✓ Found ${customerIdMap.size} customer mappings`);

  // Build agent ID map (legacy ID -> current ID)
  console.log("👥 Building agent mappings...");
  const borluulagchData = loadJsonData("borluulagch");
  const agentIdMap = new Map<number, number>();
  
  for (const row of borluulagchData.rows) {
    const obj = mapRowToObject(borluulagchData.columns, row);
    const email = `agent${obj.id}@warehouse.com`;
    const agent = await prisma.employee.findUnique({
      where: { email },
      select: { id: true },
    });
    if (agent) {
      agentIdMap.set(obj.id, agent.id);
    }
  }
  console.log(`  ✓ Found ${agentIdMap.size} agent mappings`);

  // Load vldegdel data to map vldegdeliin_id -> baraanii_id
  console.log("📋 Loading order data...");
  const vldegdelData = loadJsonData("vldegdel");
  const vldegdelToBaraaMap = new Map<number, number>();
  for (const row of vldegdelData.rows) {
    const obj = mapRowToObject(vldegdelData.columns, row);
    vldegdelToBaraaMap.set(obj.id, obj.baraanii_id);
  }
  console.log(`  ✓ Loaded ${vldegdelToBaraaMap.size} vldegdel -> baraa mappings`);

  // Load order data
  const zahialgaData = loadJsonData("zahialga");
  console.log(`  ✓ Total order items to process: ${zahialgaData.rows.length}`);

  // Group order items by customer, date, and agent to create orders
  const orderGroups = new Map<string, any[]>();

  for (const row of zahialgaData.rows) {
    const obj = mapRowToObject(zahialgaData.columns, row);

    const customerId = obj.baiguulgiin_id
      ? customerIdMap.get(obj.baiguulgiin_id)
      : null;
    const agentId = obj.borluulagch_id
      ? agentIdMap.get(obj.borluulagch_id)
      : null;

    // Get product ID through vldegdel mapping
    const legacyBaraaId = obj.vldegdeliin_id
      ? vldegdelToBaraaMap.get(obj.vldegdeliin_id)
      : null;
    const productId = legacyBaraaId
      ? productIdMap.get(legacyBaraaId)
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
    `\n📊 Found ${orderGroups.size} order groups from ${zahialgaData.rows.length} items`
  );

  // Import all orders
  const allOrders = Array.from(orderGroups.entries());

  let ordersCreated = 0;
  let orderItemsCreated = 0;

  console.log("\n🚀 Creating orders...");

  await batchProcess(
    allOrders,
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
            (sum: number, item: any) => sum + (item.totalPrice || 0),
            0
          );
          const vatAmount = 0;
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

  console.log("\n" + "=".repeat(60));
  console.log("ORDER SEED SUMMARY");
  console.log("=".repeat(60));
  console.log(`  🛒 Orders created: ${ordersCreated}`);
  console.log(`  📦 Order items created: ${orderItemsCreated}`);
  console.log("=".repeat(60));
  console.log("\n✅ Orders seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during orders seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

