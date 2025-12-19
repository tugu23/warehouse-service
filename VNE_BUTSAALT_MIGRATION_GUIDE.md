# VNE болон BUTSAALT өгөгдлийг системд оруулах заавар

Энэ заавар нь хуучин системийн `vne.json` (үнийн мэдээлэл) болон `butsaalt.json` (буцаалтын мэдээлэл) файлуудыг шинэ warehouse системд хэрхэн оруулах талаар тайлбарлана.

## Өөрчлөлтүүд

### 1. Prisma Schema Өөрчлөлтүүд

#### ProductPrice Model (шинээр нэмэгдсэн)
Бүтээгдэхүүний харилцагчийн төрөл бүрт зориулсан үнийг хадгалдаг:

```prisma
model ProductPrice {
  id              Int          @id @default(autoincrement())
  productId       Int          @map("product_id")
  customerTypeId  Int          @map("customer_type_id")
  price           Decimal      @db.Decimal(10, 2)
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")
  product         Product      @relation(fields: [productId], references: [id])
  customerType    CustomerType @relation(fields: [customerTypeId], references: [id])
  
  @@unique([productId, customerTypeId])
  @@map("product_prices")
}
```

#### Return Model (шинэчлэгдсэн)
Буцаалтын мэдээллийг илүү дэлгэрэнгүй хадгалах боломжтой болсон:

```prisma
model Return {
  id          Int       @id @default(autoincrement())
  orderId     Int?      @map("order_id")                    // Одоо optional
  productId   Int       @map("product_id")
  customerId  Int?      @map("customer_id")                 // Шинэ
  quantity    Int
  unitPrice   Decimal?  @map("unit_price")                  // Шинэ
  reason      String?
  returnDate  DateTime  @default(now()) @map("return_date")
  expiryDate  DateTime? @map("expiry_date")                 // Шинэ
  notes       String?                                       // Шинэ
  order       Order?    @relation(fields: [orderId], references: [id])
  product     Product   @relation(fields: [productId], references: [id])
  
  @@map("returns")
}
```

### 2. Migration

Migration файл аль хэдийн бэлэн болсон:
```
prisma/migrations/20251219000000_add_product_price_and_update_return/migration.sql
```

Database асаалттай байх үед migration ажиллуулах:
```bash
npx prisma migrate deploy
```

Эсвэл development mode-д:
```bash
npx prisma migrate dev
```

### 3. Өгөгдөл оруулах

#### Бэлтгэл

1. Database асаалттай эсэхийг шалгах:
```bash
docker-compose up -d
```

2. Prisma client үүсгэх:
```bash
npx prisma generate
```

#### Seed Script ажиллуулах

```bash
npx ts-node prisma/seed-vne-butsaalt.ts
```

Энэ script нь:
- ✅ `vne.json` файлаас үнийн мэдээллийг уншиж `product_prices` хүснэгтэд оруулна
- ✅ `butsaalt.json` файлаас буцаалтын мэдээллийг уншиж `returns` хүснэгтэд оруулна
- ✅ Хэрэв бүтээгдэхүүн эсвэл харилцагчийн төрөл олдохгүй бол алдааг хэвлэнэ
- ✅ Үнэ 0 байвал алгасна
- ✅ Огноо форматыг зөв parse хийнэ ("2017-08" → "2017-08-01")

## API Endpoints

Шинэ ProductPrice API endpoints нэмэгдсэн:

### 1. Үнийн жагсаалт авах
```http
GET /api/product-prices
Authorization: Bearer <token>

Query Parameters:
- productId: integer (optional)
- customerTypeId: integer (optional)
```

### 2. Тодорхой үнийг авах
```http
GET /api/product-prices/:id
Authorization: Bearer <token>
```

### 3. Бүтээгдэхүүний бүх үнийг авах
```http
GET /api/product-prices/product/:productId
Authorization: Bearer <token>
```

### 4. Үнэ үүсгэх
```http
POST /api/product-prices
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 422,
  "customerTypeId": 1,
  "price": 16990
}
```

### 5. Үнэ шинэчлэх
```http
PUT /api/product-prices/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 17500
}
```

### 6. Үнэ устгах
```http
DELETE /api/product-prices/:id
Authorization: Bearer <token>
```

## Өгөгдлийн таарч байгаа байдал

### vne.json → ProductPrice

| Хуучин талбар | Шинэ талбар | Тайлбар |
|--------------|------------|---------|
| id | - | Auto-generated |
| baraanii_id | productId | Бүтээгдэхүүний ID |
| turul_id | customerTypeId | Харилцагчийн төрлийн ID |
| vne | price | Үнэ |

**Жишээ:**
```json
[353, 422, 8, 0]      // vne.json
→
{
  productId: 422,
  customerTypeId: 8,
  price: 0
}
```

### butsaalt.json → Return

| Хуучин талбар | Шинэ талбар | Тайлбар |
|--------------|------------|---------|
| id | - | Auto-generated |
| baraanii_id | productId | Бүтээгдэхүүний ID |
| baiguullgin_id | customerId | Харилцагчийн ID (nullable) |
| negj | - | Алгасах (ашиглахгүй) |
| too | quantity | Тоо ширхэг |
| negj_une | unitPrice | Нэгж үнэ |
| ognoo | returnDate | Буцаалтын огноо |
| duusah_ognoo | expiryDate | Дуусах хугацаа |
| not_dun | notes | Тэмдэглэл |

**Жишээ:**
```json
[1, 528, null, null, 10, null, "2017-08", null, null]      // butsaalt.json
→
{
  productId: 528,
  customerId: null,
  quantity: 10,
  unitPrice: null,
  returnDate: "2017-08-01T00:00:00.000Z",
  expiryDate: null,
  notes: null,
  reason: "Хуучин системээс импорт хийсэн"
}
```

## Анхаарах зүйлс

1. **Foreign Key Constraints**: 
   - `productId` нь `products` хүснэгтэд байх ёстой
   - `customerTypeId` нь `customer_types` хүснэгтэд байх ёстой
   - `customerId` (Return-д) нь `customers` хүснэгтэд байх ёстой

2. **Unique Constraint**:
   - ProductPrice дээр `productId + customerTypeId` unique байна
   - Нэг бүтээгдэхүүний нэг төрлийн харилцагчид зориулсан үнэ зөвхөн нэг удаа байна

3. **Үнэ 0 байвал**:
   - Seed script нь үнэ 0 байвал алгасна

4. **Огноо форматууд**:
   - "2017-08" → "2017-08-01" болгоно
   - "2016-10-11" зэрэг бүрэн огноо нь тохирно

## Тест хийх

### ProductPrice API test
```bash
# Нэвтрэх
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@warehouse.com", "password": "admin123"}'

# Үнийн жагсаалт авах
curl -X GET http://localhost:3000/api/product-prices \
  -H "Authorization: Bearer <your-token>"

# Бүтээгдэхүүний үнийг авах
curl -X GET http://localhost:3000/api/product-prices/product/422 \
  -H "Authorization: Bearer <your-token>"
```

### Database шалгах
```bash
# Prisma Studio нээх
npx prisma studio

# Эсвэл psql ашиглах
psql -U warehouse_user -d warehouse_db -h localhost

# ProductPrice тоо
SELECT COUNT(*) FROM product_prices;

# Return тоо
SELECT COUNT(*) FROM returns;
```

## Асуудал гарвал

### Migration алдаа
```bash
# Migration reset хийх (БҮХ ӨГӨГДӨЛ УСТАНА!)
npx prisma migrate reset

# Эсвэл зөвхөн schema sync хийх
npx prisma db push
```

### Seed алдаа
- Product ID эсвэл CustomerType ID олдохгүй гэсэн алдаа гарвал эхлээд тэдгээрийн датаг оруулах хэрэгтэй
- Foreign key constraint алдаа гарвал тохирох өгөгдөл байгаа эсэхийг шалгана уу

## Дэмжлэг

Асуудал гарвал доорх файлуудыг шалгана уу:
- `prisma/schema.prisma` - Schema тодорхойлолт
- `prisma/seed-vne-butsaalt.ts` - Seed script
- `src/controllers/productPrice.controller.ts` - ProductPrice controller
- `src/routes/productPrice.routes.ts` - ProductPrice routes

