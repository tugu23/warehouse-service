import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface VneData {
  name: string;
  columns: string[];
  rows: any[][];
}

interface ButsaaltData {
  name: string;
  columns: string[];
  rows: any[][];
}

interface ProductIdMapping {
  [oldId: number]: number;
}

interface CustomerTypeIdMapping {
  [oldId: number]: number;
}

interface CustomerIdMapping {
  [oldId: number]: number;
}

async function seedVneData() {
  console.log('🔄 vne.json өгөгдөл уншиж байна...');
  
  const vnePath = path.join(__dirname, 'parsed-data', 'vne.json');
  const vneRaw = fs.readFileSync(vnePath, 'utf-8');
  const vneData: VneData = JSON.parse(vneRaw);
  
  console.log(`📊 Нийт ${vneData.rows.length} мөр олдлоо`);
  
  // Product ID mapping хийх (хуучин baraa id -> шинэ product id)
  const products = await prisma.product.findMany({
    select: { id: true }
  });
  
  // CustomerType ID mapping хийх (хуучин turul id -> шинэ customer_type id)
  const customerTypes = await prisma.customerType.findMany({
    select: { id: true, typeName: true }
  });
  
  // Байгаа бүтээгдэхүүний ID-уудыг Set-т хадгалах (хурдан шалгах)
  const productIds = new Set(products.map(p => p.id));
  const customerTypeIds = new Set(customerTypes.map(ct => ct.id));
  
  console.log(`📦 Системд ${products.length} бүтээгдэхүүн байна`);
  console.log(`👥 Системд ${customerTypes.length} харилцагчийн төрөл байна`);
  
  // vne.json columns: ["id", "baraanii_id", "turul_id", "vne"]
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const row of vneData.rows) {
    const [id, baraanii_id, turul_id, vne] = row;
    
    // Үнэ 0 байвал алгасна
    if (vne === 0 || vne === null) {
      skippedCount++;
      continue;
    }
    
    // Бүтээгдэхүүн болон харилцагчийн төрөл байгаа эсэхийг шалгах
    if (!productIds.has(baraanii_id)) {
      skippedCount++;
      continue;
    }
    
    if (!customerTypeIds.has(turul_id)) {
      skippedCount++;
      continue;
    }
    
    try {
      // ProductPrice үүсгэх эсвэл шинэчлэх
      await prisma.productPrice.upsert({
        where: {
          productId_customerTypeId: {
            productId: baraanii_id,
            customerTypeId: turul_id
          }
        },
        update: {
          price: vne
        },
        create: {
          productId: baraanii_id,
          customerTypeId: turul_id,
          price: vne
        }
      });
      
      processedCount++;
      
      if (processedCount % 100 === 0) {
        console.log(`✅ ${processedCount} мөр боловсруулагдсан...`);
      }
    } catch (error: any) {
      errorCount++;
      if (errorCount <= 10) {
        console.error(`❌ Алдаа гарлаа (baraanii_id: ${baraanii_id}, turul_id: ${turul_id}):`, error.message);
      }
    }
  }
  
  console.log(`\n✅ vne.json өгөгдөл амжилттай орууллаа!`);
  console.log(`   - Боловсруулсан: ${processedCount}`);
  console.log(`   - Алгассан: ${skippedCount}`);
  console.log(`   - Алдаатай: ${errorCount}`);
}

async function seedButsaaltData() {
  console.log(`\n🔄 butsaalt.json өгөгдөл уншиж байна...`);
  
  const butsaaltPath = path.join(__dirname, 'parsed-data', 'butsaalt.json');
  const butsaaltRaw = fs.readFileSync(butsaaltPath, 'utf-8');
  const butsaaltData: ButsaaltData = JSON.parse(butsaaltRaw);
  
  console.log(`📊 Нийт ${butsaaltData.rows.length} мөр олдлоо`);
  
  // Байгаа бүтээгдэхүүний ID-уудыг Set-т хадгалах
  const products = await prisma.product.findMany({
    select: { id: true }
  });
  const productIds = new Set(products.map(p => p.id));
  
  console.log(`📦 Системд ${products.length} бүтээгдэхүүн байна`);
  
  // butsaalt.json columns: ["id", "baraanii_id", "baiguullgin_id", "negj", "too", "negj_une", "ognoo", "duusah_ognoo", "not_dun"]
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const row of butsaaltData.rows) {
    const [id, baraanii_id, baiguullgin_id, negj, too, negj_une, ognoo, duusah_ognoo, not_dun] = row;
    
    // Хэрэв бүтээгдэхүүн эсвэл тоо хэмжээ байхгүй бол алгасна
    if (!baraanii_id || !too) {
      skippedCount++;
      continue;
    }
    
    // Бүтээгдэхүүн байгаа эсэхийг шалгах
    if (!productIds.has(baraanii_id)) {
      skippedCount++;
      continue;
    }
    
    try {
      // Огноог parse хийх
      let returnDate = new Date();
      if (ognoo) {
        if (ognoo.includes('-') && ognoo.split('-').length === 2) {
          // Format: "2017-08" -> "2017-08-01"
          returnDate = new Date(`${ognoo}-01`);
        } else {
          returnDate = new Date(ognoo);
        }
      }
      
      let expiryDate = null;
      if (duusah_ognoo) {
        if (duusah_ognoo.includes('-') && duusah_ognoo.split('-').length === 2) {
          expiryDate = new Date(`${duusah_ognoo}-01`);
        } else {
          expiryDate = new Date(duusah_ognoo);
        }
      }
      
      // Return үүсгэх
      await prisma.return.create({
        data: {
          productId: baraanii_id,
          customerId: baiguullgin_id || null,
          quantity: too,
          unitPrice: negj_une || null,
          returnDate: returnDate,
          expiryDate: expiryDate,
          notes: not_dun || null,
          reason: 'Хуучин системээс импорт хийсэн'
        }
      });
      
      processedCount++;
      
      if (processedCount % 50 === 0) {
        console.log(`✅ ${processedCount} мөр боловсруулагдсан...`);
      }
    } catch (error: any) {
      errorCount++;
      if (errorCount <= 10) {
        console.error(`❌ Алдаа гарлаа (baraanii_id: ${baraanii_id}):`, error.message);
      }
    }
  }
  
  console.log(`\n✅ butsaalt.json өгөгдөл амжилттай орууллаа!`);
  console.log(`   - Боловсруулсан: ${processedCount}`);
  console.log(`   - Алгассан: ${skippedCount}`);
  console.log(`   - Алдаатай: ${errorCount}`);
}

async function main() {
  console.log('🚀 vne.json болон butsaalt.json өгөгдөл оруулж эхэлж байна...\n');
  
  try {
    // 1. vne.json өгөгдөл оруулах
    await seedVneData();
    
    // 2. butsaalt.json өгөгдөл оруулах
    await seedButsaaltData();
    
    console.log('\n🎉 Бүх өгөгдөл амжилттай орууллаа!');
  } catch (error) {
    console.error('❌ Алдаа гарлаа:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

