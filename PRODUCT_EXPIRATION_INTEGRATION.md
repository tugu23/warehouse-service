# Бүтээгдэхүүний үнэ ба хугацаа мэдээллийн интеграци

## Тайлбар

Энэ систем нь `vldegdel.json` файлаас бүтээгдэхүүний үлдэгдэл, хугацаа мэдээллийг `baraa.json` файлын бүтээгдэхүүн мэдээллийн дагуу нэгтгэж ажиллана.

## Файлын бүтэц

### vldegdel.json
```json
{
  "columns": [
    "id",              // Үлдэгдлийн ID
    "baraanii_id",     // Бараа бүтээгдэхүүний ID (baraa.json-тай холбогдох)
    "too",             // Тоо ширхэг (Үлдэгдэл)
    "vildverlesen_hugatsaa",  // Үйлдвэрлэсэн огноо
    "duusah_hugatsaa",        // Дуусах хугацаа
    "hadgalah_hugatsaa"       // Хадгалах хугацаа (сараар)
  ]
}
```

### baraa.json
```json
{
  "columns": [
    "id",           // Бүтээгдэхүүний ID
    "mon_ner",      // Монгол нэр
    "eng_ner",      // Англи нэр
    "price_sh_w",   // Бөөний үнэ
    "price_sh_d",   // Жижиглэн үнэ
    ...
  ]
}
```

## Хэрэгжүүлэлт

### 1. Database Schema

`ProductBatch` модель:
```prisma
model ProductBatch {
  id              Int       @id @default(autoincrement())
  productId       Int       @map("product_id")
  batchNumber     String    @map("batch_number")
  arrivalDate     DateTime  @map("arrival_date")
  expiryDate      DateTime? @map("expiry_date")
  quantity        Int
  isActive        Boolean   @default(true)
  product         Product   @relation(...)
}
```

### 2. Import Script

Өгөгдөл оруулах скрипт: `prisma/seed-vldegdel.ts`

```bash
# Үлдэгдэл, хугацаа мэдээлэл оруулах
npm run seed:vldegdel
# эсвэл
npx ts-node prisma/seed-vldegdel.ts
```

## API Endpoints

### Бүтээгдэхүүний жагсаалт (Batch мэдээлэлтэй)

**GET** `/api/products`

**Query Parameters:**
- `page`: Хуудасны дугаар (өгөгдмөл: 1)
- `limit`: Хуудас дахь бүтээгдэхүүний тоо (өгөгдмөл: 10, "all" гэж өгвөл бүгд)
- `search`: Хайх үг (нэр, код, barcode-оор)

**Response:**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 422,
        "nameMongolian": "Дашида монго 1кг",
        "nameEnglish": "Mongo dashi 1kg",
        "stockQuantity": 706,
        "priceWholesale": 4686.00,
        "priceRetail": null,
        "supplier": { ... },
        "category": { ... },
        "batches": [
          {
            "id": 1,
            "batchNumber": "BATCH-870-422",
            "arrivalDate": "2016-12-01T00:00:00.000Z",
            "expiryDate": "2018-04-24T00:00:00.000Z",
            "quantity": 706,
            "isActive": false
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 840,
      "totalPages": 84
    }
  }
}
```

### Тодорхой бүтээгдэхүүний дэлгэрэнгүй

**GET** `/api/products/:id`

**Response:**
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 426,
      "nameMongolian": "Булдак cheese 135гр",
      "stockQuantity": 3068,
      "priceWholesale": null,
      "priceRetail": null,
      "batches": [
        {
          "batchNumber": "BATCH-876-426",
          "arrivalDate": "2016-11-04T00:00:00.000Z",
          "expiryDate": "2030-01-01T00:00:00.000Z",
          "quantity": 3068,
          "isActive": true
        }
      ]
    }
  }
}
```

### Barcode-оор хайх

**GET** `/api/products/barcode/:barcode`

Batch мэдээллийг дуусах хугацааны дарааллаар харуулна.

## Frontend дээр харуулах

### Batch мэдээллийг ангилах

```typescript
// Батчуудыг хугацаа дууссан эсэхээр ангилах
const activeBatches = product.batches.filter(b => 
  b.isActive && (!b.expiryDate || new Date(b.expiryDate) > new Date())
);

const expiredBatches = product.batches.filter(b => 
  !b.isActive || (b.expiryDate && new Date(b.expiryDate) <= new Date())
);
```

### UI Components

```tsx
// Хугацааны статус харуулах
function ExpiryStatus({ batch }: { batch: ProductBatch }) {
  const expiryDate = batch.expiryDate ? new Date(batch.expiryDate) : null;
  const today = new Date();
  
  if (!expiryDate) {
    return <Chip label="Хугацаагүй" color="default" />;
  }
  
  const daysUntilExpiry = Math.floor(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysUntilExpiry < 0) {
    return <Chip label="Хугацаа дууссан" color="error" />;
  } else if (daysUntilExpiry < 30) {
    return <Chip label={`${daysUntilExpiry} хоног үлдсэн`} color="warning" />;
  } else if (daysUntilExpiry < 90) {
    return <Chip label={`${daysUntilExpiry} хоног үлдсэн`} color="info" />;
  } else {
    return <Chip label="Хугацаа сайн" color="success" />;
  }
}

// Бүтээгдэхүүний хүснэгтэнд batch мэдээлэл нэмэх
<TableCell>
  <Box>
    <Typography>{product.nameMongolian}</Typography>
    {product.batches && product.batches.length > 0 && (
      <Box mt={0.5}>
        {product.batches.slice(0, 2).map(batch => (
          <ExpiryStatus key={batch.id} batch={batch} />
        ))}
        {product.batches.length > 2 && (
          <Typography variant="caption" color="textSecondary">
            +{product.batches.length - 2} багц
          </Typography>
        )}
      </Box>
    )}
  </Box>
</TableCell>

<TableCell>
  <Typography variant="body2">
    Нийт: {product.stockQuantity}
  </Typography>
  {product.batches && product.batches.length > 0 && (
    <Typography variant="caption" color="textSecondary">
      {product.batches.length} багцад хуваагдсан
    </Typography>
  )}
</TableCell>
```

## Тохиргоо

### package.json-д script нэмэх

```json
{
  "scripts": {
    "seed:vldegdel": "ts-node prisma/seed-vldegdel.ts"
  }
}
```

## Ашиглалтын дараалал

1. **Бүтээгдэхүүн оруулах**
   ```bash
   npm run seed:baraa
   ```

2. **Үлдэгдэл, хугацаа мэдээлэл оруулах**
   ```bash
   npm run seed:vldegdel
   ```

3. **API ашиглах**
   - Бүтээгдэхүүний жагсаалт авахдаа `batches` талбар автоматаар агуулагдана
   - Хугацаа дууссан/дуусаж байгаа бараанууд анхааруулга харуулах
   - Багц бүрийн үлдэгдэл тоо харуулах

## Давуу талууд

1. ✅ Бүтээгдэхүүн бүрийн олон batch-ийг хадгална
2. ✅ Хугацаа дууссан барааг автоматаар тодорхойлно
3. ✅ Үлдэгдлийг batch-аар хянаж болно
4. ✅ FIFO (First In First Out) эсвэл FEFO (First Expired First Out) системийг хэрэгжүүлж болно
5. ✅ Хугацаа дуусах гэж байгаа барааны тайлан авч болно

## Тайлан авах

```typescript
// Хугацаа дуусах гэж байгаа бараанууд (30 хоногийн дотор)
const upcomingExpiry = await prisma.productBatch.findMany({
  where: {
    isActive: true,
    expiryDate: {
      gte: new Date(),
      lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  },
  include: {
    product: {
      include: {
        category: true,
        supplier: true
      }
    }
  },
  orderBy: {
    expiryDate: 'asc'
  }
});

// Хугацаа дууссан бараанууд
const expired = await prisma.productBatch.findMany({
  where: {
    expiryDate: {
      lt: new Date()
    }
  },
  include: {
    product: true
  }
});
```

## Анхааруулах зүйлс

- 🔴 Хугацаа дууссан бараа (Улаан)
- 🟡 30 хоногийн дотор хугацаа дуусах (Шар)
- 🔵 90 хоногийн дотор хугацаа дуусах (Цэнхэр)
- 🟢 90+ хоногоос дээш хугацаатай (Ногоон)

