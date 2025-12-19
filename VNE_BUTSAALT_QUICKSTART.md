# VNE болон BUTSAALT - Хурдан эхлүүлэх заавар

## Товч агуулга

`vne.json` болон `butsaalt.json` хуучин системийн өгөгдлийг шинэ warehouse системд амжилттай нэмлээ:

- ✅ **ProductPrice model** - Бүтээгдэхүүний харилцагчийн төрөл бүрт зориулсан үнэ
- ✅ **Return model өргөтгөл** - Буцаалтын дэлгэрэнгүй мэдээлэл
- ✅ **Migration файл** - Database өөрчлөлтүүд бэлэн
- ✅ **Seed script** - Өгөгдөл оруулах автомат скрипт
- ✅ **REST API endpoints** - ProductPrice-н CRUD үйлдлүүд

## Хурдан эхлүүлэх

### 1. Migration ажиллуулах
```bash
cd /Users/tuguldur.tu/warehouse-service
docker-compose up -d
npx prisma migrate deploy
npx prisma generate
```

### 2. Өгөгдөл оруулах
```bash
npx ts-node prisma/seed-vne-butsaalt.ts
```

### 3. Server эхлүүлэх
```bash
npm run dev
```

### 4. API тест хийх
```bash
# Swagger docs нээх
open http://localhost:3000/api-docs

# Эсвэл curl ашиглах
curl http://localhost:3000/api/product-prices \
  -H "Authorization: Bearer <token>"
```

## API Endpoints

| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| GET | `/api/product-prices` | Бүх үнийн жагсаалт |
| GET | `/api/product-prices/:id` | Тодорхой үнэ |
| GET | `/api/product-prices/product/:productId` | Бүтээгдэхүүний бүх үнэ |
| POST | `/api/product-prices` | Үнэ үүсгэх |
| PUT | `/api/product-prices/:id` | Үнэ шинэчлэх |
| DELETE | `/api/product-prices/:id` | Үнэ устгах |

## Өгөгдлийн харгалзаа

### vne.json → ProductPrice
```
[id, baraanii_id, turul_id, vne] 
→ 
{ productId, customerTypeId, price }
```

### butsaalt.json → Return
```
[id, baraanii_id, baiguullgin_id, negj, too, negj_une, ognoo, duusah_ognoo, not_dun]
→
{ productId, customerId, quantity, unitPrice, returnDate, expiryDate, notes }
```

## Дэлгэрэнгүй заавар

Дэлгэрэнгүй мэдээллийг доорх файлаас үзнэ үү:
📖 [VNE_BUTSAALT_MIGRATION_GUIDE.md](./VNE_BUTSAALT_MIGRATION_GUIDE.md)

## Үүсгэсэн файлууд

### Database
- `prisma/schema.prisma` - ProductPrice model нэмэгдсэн, Return model шинэчлэгдсэн
- `prisma/migrations/20251219000000_add_product_price_and_update_return/migration.sql`

### Scripts
- `prisma/seed-vne-butsaalt.ts` - Өгөгдөл оруулах скрипт

### API
- `src/controllers/productPrice.controller.ts`
- `src/routes/productPrice.routes.ts`
- `src/app.ts` - Route бүртгэгдсэн

### Docs
- `VNE_BUTSAALT_MIGRATION_GUIDE.md` - Дэлгэрэнгүй заавар
- `VNE_BUTSAALT_QUICKSTART.md` - Энэ файл

## Статистик (жишээ)

vne.json оруулсны дараа:
```
✅ 8,507 мөр боловсруулагдсан
✅ ~2,000 үнийн мэдээлэл нэмэгдсэн (үнэ 0 байснуудыг алгассан)
```

butsaalt.json оруулсны дараа:
```
✅ 1,160 мөр боловсруулагдсан
✅ ~1,000+ буцаалтын мэдээлэл нэмэгдсэн
```

## Шалгах

```bash
# Prisma Studio-гоор шалгах
npx prisma studio

# Database-аар шалгах
psql -U warehouse_user -d warehouse_db -h localhost
SELECT COUNT(*) FROM product_prices;
SELECT COUNT(*) FROM returns;
```

Амжилт хүсье! 🎉

