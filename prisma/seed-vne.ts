import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface VneData {
  name: string;
  columns: string[];
  rows: Array<[number, number, number, number]>; // [id, baraanii_id, turul_id, vne]
}

async function main() {
  console.log('🏷️  Starting price data seed from vne.json...');

  // Read vne.json file
  const vneFilePath = path.join(__dirname, 'parsed-data', 'vne.json');
  const vneDataRaw = fs.readFileSync(vneFilePath, 'utf-8');
  const vneData: VneData = JSON.parse(vneDataRaw);

  console.log(`📊 Total price records to process: ${vneData.rows.length}`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // Process each price record
  for (const row of vneData.rows) {
    const [id, baraaniiId, turulId, vne] = row;

    try {
      // Skip if price is 0
      if (vne === 0) {
        skipCount++;
        continue;
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: baraaniiId }
      });

      if (!product) {
        console.log(`⚠️  Product not found for baraanii_id: ${baraaniiId}, skipping...`);
        skipCount++;
        continue;
      }

      // Check if customer type exists
      const customerType = await prisma.customerType.findUnique({
        where: { id: turulId }
      });

      if (!customerType) {
        console.log(`⚠️  Customer type not found for turul_id: ${turulId}, skipping...`);
        skipCount++;
        continue;
      }

      // Upsert product price
      await prisma.productPrice.upsert({
        where: {
          productId_customerTypeId: {
            productId: baraaniiId,
            customerTypeId: turulId
          }
        },
        update: {
          price: vne
        },
        create: {
          productId: baraaniiId,
          customerTypeId: turulId,
          price: vne
        }
      });

      successCount++;

      if (successCount % 100 === 0) {
        console.log(`✅ Processed ${successCount} prices...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Error processing price for product ${baraaniiId}, customer type ${turulId}:`, error);
    }
  }

  console.log('\n📊 Price Data Seed Summary:');
  console.log(`   ✅ Successfully seeded: ${successCount} prices`);
  console.log(`   ⚠️  Skipped: ${skipCount} records`);
  console.log(`   ❌ Errors: ${errorCount} records`);
  console.log('\n🎉 Price data seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during price seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

