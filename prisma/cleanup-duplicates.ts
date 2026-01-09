/**
 * Cleanup Duplicate Records Script
 * Removes duplicate customers, orders, and other records created by multiple seed runs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Starting duplicate cleanup...\n");

  // ============================================================================
  // STEP 1: Check current counts
  // ============================================================================
  console.log("📊 Current record counts:");
  const customerCount = await prisma.customer.count();
  const orderCount = await prisma.order.count();
  const productCount = await prisma.product.count();
  
  console.log(`  Customers: ${customerCount}`);
  console.log(`  Orders: ${orderCount}`);
  console.log(`  Products: ${productCount}`);

  // ============================================================================
  // STEP 2: Delete duplicate customers using SQL (faster and handles FK)
  // ============================================================================
  console.log("\n🏢 Cleaning up duplicate customers and related data...");
  
  // Step 2a: Delete order_items for orders of duplicate customers
  console.log("  Deleting order items for duplicate customers...");
  const orderItemsDeleted = await prisma.$executeRaw`
    DELETE FROM order_items WHERE order_id IN (
      SELECT o.id FROM orders o 
      WHERE o.customer_id NOT IN (
        SELECT MIN(id) FROM customers GROUP BY name
      )
    )
  `;
  console.log(`  ✓ Deleted ${orderItemsDeleted} order items`);

  // Step 2b: Delete payments for orders of duplicate customers
  console.log("  Deleting payments for duplicate customers...");
  const paymentsDeleted = await prisma.$executeRaw`
    DELETE FROM payments WHERE order_id IN (
      SELECT o.id FROM orders o 
      WHERE o.customer_id NOT IN (
        SELECT MIN(id) FROM customers GROUP BY name
      )
    )
  `;
  console.log(`  ✓ Deleted ${paymentsDeleted} payments`);

  // Step 2c: Delete returns for orders of duplicate customers
  console.log("  Deleting returns for duplicate customers...");
  const returnsDeleted = await prisma.$executeRaw`
    DELETE FROM returns WHERE order_id IN (
      SELECT o.id FROM orders o 
      WHERE o.customer_id NOT IN (
        SELECT MIN(id) FROM customers GROUP BY name
      )
    )
  `;
  console.log(`  ✓ Deleted ${returnsDeleted} returns`);

  // Step 2d: Delete orders for duplicate customers
  console.log("  Deleting orders for duplicate customers...");
  const ordersForDupsDeleted = await prisma.$executeRaw`
    DELETE FROM orders 
    WHERE customer_id NOT IN (
      SELECT MIN(id) FROM customers GROUP BY name
    )
  `;
  console.log(`  ✓ Deleted ${ordersForDupsDeleted} orders`);

  // Step 2e: Delete duplicate customers
  console.log("  Deleting duplicate customers...");
  const customersDeleted = await prisma.$executeRaw`
    DELETE FROM customers 
    WHERE id NOT IN (
      SELECT MIN(id) FROM customers GROUP BY name
    )
  `;
  console.log(`  ✓ Deleted ${customersDeleted} duplicate customers`);

  // ============================================================================
  // STEP 3: Clean up remaining duplicate orders
  // ============================================================================
  console.log("\n🛒 Cleaning up duplicate orders...");
  
  // Step 3a: Delete order_items for duplicate orders
  console.log("  Deleting order items for duplicate orders...");
  const dupOrderItemsDeleted = await prisma.$executeRaw`
    DELETE FROM order_items WHERE order_id NOT IN (
      SELECT MIN(id) FROM orders 
      GROUP BY customer_id, agent_id, DATE(order_date), total_amount
    )
  `;
  console.log(`  ✓ Deleted ${dupOrderItemsDeleted} order items`);

  // Step 3b: Delete payments for duplicate orders
  console.log("  Deleting payments for duplicate orders...");
  const dupPaymentsDeleted = await prisma.$executeRaw`
    DELETE FROM payments WHERE order_id NOT IN (
      SELECT MIN(id) FROM orders 
      GROUP BY customer_id, agent_id, DATE(order_date), total_amount
    )
  `;
  console.log(`  ✓ Deleted ${dupPaymentsDeleted} payments`);

  // Step 3c: Delete returns for duplicate orders
  console.log("  Deleting returns for duplicate orders...");
  const dupReturnsDeleted = await prisma.$executeRaw`
    DELETE FROM returns WHERE order_id NOT IN (
      SELECT MIN(id) FROM orders 
      GROUP BY customer_id, agent_id, DATE(order_date), total_amount
    )
  `;
  console.log(`  ✓ Deleted ${dupReturnsDeleted} returns`);

  // Step 3d: Delete duplicate orders
  console.log("  Deleting duplicate orders...");
  const dupOrdersDeleted = await prisma.$executeRaw`
    DELETE FROM orders WHERE id NOT IN (
      SELECT MIN(id) FROM orders 
      GROUP BY customer_id, agent_id, DATE(order_date), total_amount
    )
  `;
  console.log(`  ✓ Deleted ${dupOrdersDeleted} duplicate orders`);

  // ============================================================================
  // STEP 4: Final counts
  // ============================================================================
  console.log("\n📊 Final record counts:");
  const finalCustomerCount = await prisma.customer.count();
  const finalOrderCount = await prisma.order.count();
  const finalProductCount = await prisma.product.count();
  
  console.log(`  Customers: ${finalCustomerCount} (was ${customerCount}, removed ${customerCount - finalCustomerCount})`);
  console.log(`  Orders: ${finalOrderCount} (was ${orderCount}, removed ${orderCount - finalOrderCount})`);
  console.log(`  Products: ${finalProductCount} (unchanged)`);

  console.log("\n✅ Cleanup completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during cleanup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
