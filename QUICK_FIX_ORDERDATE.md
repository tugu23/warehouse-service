# 🚀 Хурдан шийдэл: orderDate ашиглах

## Асуудал
Order model дээр `createdAt` талбар байхгүй, зөвхөн `orderDate` байна.

## ✅ Frontend засах

### 1. OrdersPage.tsx

```typescript
// ❌ БУРУУ - createdAt байхгүй
{
  id: 'createdAt',
  label: 'Created At',
  format: (row: Order) => formatDateTimeMN(row.createdAt),
}

// ✅ ЗӨВ - orderDate ашиглах
{
  id: 'orderDate',
  label: 'Огноо',  // эсвэл 'Үүсгэсэн огноо'
  format: (row: Order) => formatDateTimeMN(row.orderDate),
}
```

### 2. OrderDetailsModal.tsx

```typescript
// ❌ БУРУУ
<div className="info-row">
  <span className="label">Огноо:</span>
  <span className="value">
    {formatDateMN(order.createdAt)}
  </span>
</div>

// ✅ ЗӨВ
<div className="info-row">
  <span className="label">Захиалгын огноо:</span>
  <span className="value">
    {formatDateMN(order.orderDate)}
  </span>
</div>
```

### 3. TypeScript Interface

```typescript
// types/order.ts

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;  // ✅ Энэ байна
  // createdAt: string;  // ❌ Энэ байхгүй
  customer: { name: string };
  agent: { name: string; role: { name: string } };
  totalAmount: number;
  status: string;
  // ... бусад
}
```

## ✅ Эцсийн код

### React Component:

```typescript
// OrdersTable.tsx
import { formatDateTimeMN } from '../utils/dateFormatter';

const columns = [
  { id: 'id', label: 'ID' },
  { id: 'orderNumber', label: 'Дугаар' },
  { id: 'customer', label: 'Харилцагч', format: (row) => row.customer.name },
  { id: 'totalAmount', label: 'Дүн', format: (row) => `₮${row.totalAmount}` },
  { id: 'status', label: 'Төлөв' },
  { 
    id: 'agent', 
    label: 'Үүсгэсэн', 
    format: (row) => row.agent?.name || 'N/A' 
  },
  { 
    id: 'orderDate',  // ✅ createdAt биш orderDate
    label: 'Огноо',
    format: (row) => formatDateTimeMN(row.orderDate) 
  },
];
```

### Vue Component:

```vue
<template>
  <td>{{ formatDateTimeMN(order.orderDate) }}</td>
</template>

<script setup lang="ts">
import { formatDateTimeMN } from '@/utils/dateFormatter';

interface Order {
  orderDate: string;  // ✅ createdAt биш
  // ... бусад
}
</script>
```

## 📝 Хураангуй

| Хуучин (Буруу) | Шинэ (Зөв) |
|----------------|------------|
| `order.createdAt` | `order.orderDate` |
| `row.createdAt` | `row.orderDate` |
| `Created At` | `Огноо` эсвэл `Захиалгын огноо` |

---

**Энэ өөрчлөлтийг хийсний дараа огноо харагдах болно! 📅**

