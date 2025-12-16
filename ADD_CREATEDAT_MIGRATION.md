# 🔧 Order model дээр createdAt нэмэх

## Migration үүсгэх

### 1. Prisma Schema засах

```prisma
// prisma/schema.prisma

model Order {
  id                Int           @id @default(autoincrement())
  customerId        Int           @map("customer_id")
  agentId           Int           @map("agent_id")
  orderDate         DateTime      @default(now()) @map("order_date") @db.Timestamptz(3)
  createdAt         DateTime      @default(now()) @map("created_at") @db.Timestamptz(3)  // ✅ НЭМЭХ
  updatedAt         DateTime      @updatedAt @map("updated_at") @db.Timestamptz(3)      // ✅ НЭМЭХ
  status            String        @default("Pending") @db.VarChar(50)
  // ... бусад талбарууд

  @@map("orders")
}
```

### 2. Migration үүсгэх

```bash
cd /Users/tuguldur.tu/warehouse-service

# Migration файл үүсгэх
npx prisma migrate dev --name add_timestamps_to_orders

# Эсвэл podman дотроос
podman exec -it warehouse-backend-dev npx prisma migrate dev --name add_timestamps_to_orders
```

### 3. Автоматаар үүсэх SQL:

```sql
-- migration.sql
ALTER TABLE "orders" 
ADD COLUMN "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Одоо байгаа мөрүүдэд orderDate-ийг createdAt болгож өгөх
UPDATE "orders" SET "created_at" = "order_date";
```

## ✅ Дараа нь

Backend автоматаар `createdAt` болон `updatedAt` буцаана:

```json
{
  "id": 19,
  "orderDate": "2025-12-17T10:30:00Z",
  "createdAt": "2025-12-17T10:30:00Z",  // ✅ Шинээр нэмэгдэнэ
  "updatedAt": "2025-12-17T10:30:00Z",  // ✅ Шинээр нэмэгдэнэ
  "customer": {...},
  "agent": {...}
}
```

Frontend өөрчлөлт хийх шаардлагагүй - `order.createdAt` ажиллах болно!

---

**Энэ нь зөв шийдэл гэхдээ database migration шаардана.**

