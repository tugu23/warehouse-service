# 📅 orderDate vs createdAt - Ялгаа

## Одоогийн байдал

Order model дээр **зөвхөн `orderDate`** байна:

```prisma
model Order {
  orderDate  DateTime  @default(now()) @map("order_date")
  // createdAt байхгүй
}
```

## 🤔 Хоёрын ялгаа

| Талбар | Утга | Хэзээ ашиглах |
|--------|------|---------------|
| `orderDate` | Захиалга өгсөн огноо | Бизнесийн огноо |
| `createdAt` | Database-д үүссэн огноо | Техникийн огноо |

### Жишээ:

```typescript
// Хэрэглэгч маргааш хүргэх захиалга өгөв
{
  orderDate: "2025-12-18T00:00:00Z",   // Маргааш (бизнесийн огноо)
  createdAt: "2025-12-17T10:30:00Z",   // Өнөөдөр (системд бүртгэгдсэн)
  deliveryDate: "2025-12-18T14:00:00Z" // Маргааш 2 цагт
}
```

## 🎯 Санал

### Хувилбар 1: orderDate ашиглах ⭐ (Хурдан)

**Давуу тал:**
- ✅ Шууд ажиллана
- ✅ Migration шаардлагагүй
- ✅ Бизнесийн утгатай

**Сул тал:**
- ❌ `orderDate` болон үүссэн огноо ялгаатай байж болно

**Frontend өөрчлөлт:**
```typescript
// Энгийн солих
order.createdAt  →  order.orderDate
```

### Хувилбар 2: createdAt нэмэх (Зөв)

**Давуу тал:**
- ✅ Standard approach
- ✅ Техникийн болон бизнесийн огноо тусдаа
- ✅ Audit trail (хэн, хэзээ өөрчилсөн)

**Сул тал:**
- ❌ Migration хийх шаардлагатай
- ❌ Database schema өөрчлөх

**Migration:**
```bash
npx prisma migrate dev --name add_timestamps
```

## 💡 Миний санал

### Богино хугацаанд: orderDate ашиглах

Frontend дээр:
```typescript
<td>{formatDateTimeMN(order.orderDate)}</td>
```

**Учир нь:**
- Захиалгын огноо нь илүү утга учиртай
- Шууд ажиллана
- Migration шаардлагагүй

### Урт хугацаанд: createdAt нэмэх

Database дээр timestamps нэмэх нь илүү зөв:
```prisma
model Order {
  orderDate  DateTime  // Захиалгын огноо (бизнес)
  createdAt  DateTime  // Системд үүссэн огноо (техник)
  updatedAt  DateTime  // Сүүлд засварласан огноо
}
```

## 🚀 Яг одоо хийх

**1. Хурдан шийдэл - Frontend засах:**

```typescript
// Зөвхөн 2 файл засах:

// 1. OrdersPage.tsx
format: (row) => formatDateTimeMN(row.orderDate)  // ✅

// 2. OrderDetailsModal.tsx
{formatDateMN(order.orderDate)}  // ✅
```

Дараа нь refresh хийвэл огноо харагдана!

---

**Санал:** Одоо `orderDate` ашиглаад, дараа нь migration хийж `createdAt` нэмээрэй.

