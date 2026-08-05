const prisma = require('./src/db/prisma').default;

async function test() {
  const start = Date.now();
  try {
    const result = await prisma.$queryRawUnsafe('SELECT COUNT(*) AS cnt FROM orders WHERE payment_status = $1', 'Paid');
    console.log('Query OK:', JSON.stringify(result), 'in', Date.now() - start, 'ms');
  } catch(e) {
    console.error('Query error:', e.message, 'after', Date.now() - start, 'ms');
  } finally {
    await prisma.$disconnect();
  }
}
test();