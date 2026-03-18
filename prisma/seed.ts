import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Admin employee
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminRole = await prisma.role.findFirst({ where: { name: 'Admin' } });
  if (adminRole) {
    const existing = await prisma.employee.findFirst({ where: { email: 'admin@warehouse.mn' } });
    if (!existing) {
      await prisma.employee.create({
        data: {
          name: 'Админ',
          email: 'admin@warehouse.mn',
          phoneNumber: '99001122',
          passwordHash,
          roleId: adminRole.id,
          isActive: true,
        },
      });
      console.log('Admin employee created');
    }
  }

  // 2. Customer types
  const ctCount = await prisma.customerType.count();
  if (ctCount === 0) {
    await prisma.customerType.createMany({
      data: [{ typeName: 'Бөөний' }, { typeName: 'Жижиглэн' }],
    });
    console.log('Customer types created');
  }

  // 3. Categories
  const catCount = await prisma.category.count();
  if (catCount === 0) {
    await prisma.category.createMany({
      data: [
        { nameMongolian: 'Ундаа', description: 'Ундаа болон шингэн бүтээгдэхүүн' },
        { nameMongolian: 'Нарийн боов', description: 'Нарийн боов, чихэр' },
        { nameMongolian: 'Гурилан бүтээгдэхүүн', description: 'Гурил, талх' },
        { nameMongolian: 'Ногоо, жимс', description: 'Хүнсний ногоо болон жимс' },
        { nameMongolian: 'Бусад', description: null },
      ],
    });
    console.log('Categories created');
  }

  // 4. Products
  const prodCount = await prisma.product.count();
  if (prodCount === 0) {
    const undaa = await prisma.category.findFirst({ where: { nameMongolian: 'Ундаа' } });
    const boov = await prisma.category.findFirst({ where: { nameMongolian: 'Нарийн боов' } });
    const guril = await prisma.category.findFirst({ where: { nameMongolian: 'Гурилан бүтээгдэхүүн' } });

    await prisma.product.createMany({
      data: [
        { nameMongolian: 'Coca-Cola 0.5L', productCode: 'CC-500', barcode: '8888888001', categoryId: undaa?.id, stockQuantity: 500, priceWholesale: 1500, priceRetail: 1800, isActive: true },
        { nameMongolian: 'Pepsi 0.5L', productCode: 'PP-500', barcode: '8888888002', categoryId: undaa?.id, stockQuantity: 300, priceWholesale: 1400, priceRetail: 1700, isActive: true },
        { nameMongolian: 'Sprite 0.5L', productCode: 'SP-500', barcode: '8888888003', categoryId: undaa?.id, stockQuantity: 400, priceWholesale: 1400, priceRetail: 1700, isActive: true },
        { nameMongolian: 'Oreo 137г', productCode: 'OR-137', barcode: '8801301345652', categoryId: boov?.id, stockQuantity: 200, priceWholesale: 3500, priceRetail: 4200, isActive: true },
        { nameMongolian: 'Choco Pie 12ш', productCode: 'CH-012', barcode: '8888888005', categoryId: boov?.id, stockQuantity: 150, priceWholesale: 5500, priceRetail: 6500, isActive: true },
        { nameMongolian: 'Гурил 1кг', productCode: 'FL-001', barcode: '8888888006', categoryId: guril?.id, stockQuantity: 1000, priceWholesale: 1800, priceRetail: 2200, isActive: true },
        { nameMongolian: 'Талх цагаан', productCode: 'BR-001', barcode: '8888888007', categoryId: guril?.id, stockQuantity: 100, priceWholesale: 1200, priceRetail: 1500, isActive: true },
      ],
    });
    console.log('Products created');
  }

  // 5. Customers
  const custCount = await prisma.customer.count();
  if (custCount === 0) {
    const boonii = await prisma.customerType.findFirst({ where: { typeName: 'Бөөний' } });
    const jijig = await prisma.customerType.findFirst({ where: { typeName: 'Жижиглэн' } });

    await prisma.customer.createMany({
      data: [
        { name: 'Номин Дэлгүүр', address: 'УБ, Сүхбаатар дүүрэг, 1-р хороо', phoneNumber: '88001100', locationLatitude: 47.9184, locationLongitude: 106.9177, customerTypeId: boonii!.id, isVatPayer: false },
        { name: 'Ногоон Дэлгүүр', address: 'УБ, Баянзүрх дүүрэг, 5-р хороо', phoneNumber: '88002200', locationLatitude: 47.9200, locationLongitude: 106.9300, customerTypeId: jijig!.id, isVatPayer: false },
        { name: 'Алтай Маркет', address: 'УБ, Хан-Уул дүүрэг, 3-р хороо', phoneNumber: '88003300', locationLatitude: 47.8950, locationLongitude: 106.9100, customerTypeId: boonii!.id, isVatPayer: true },
      ],
    });
    console.log('Customers created');
  }

  // 6. Store
  const storeCount = await prisma.store.count();
  if (storeCount === 0) {
    await prisma.store.create({
      data: { name: 'Төв Агуулах', address: 'УБ, Сүхбаатар дүүрэг', storeType: 'Store', isActive: true },
    });
    console.log('Store created');
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
