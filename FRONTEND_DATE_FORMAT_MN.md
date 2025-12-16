# 📅 Огноог монгол форматаар харуулах

## Асуудал

"Created At" (Үүсгэсэн огноо) хэсэгт "Invalid Date" гэж харагдаж байна.

## ✅ Шийдэл

JavaScript Date форматлах функцүүд ашиглах.

---

## 1. Utility функц үүсгэх

### React/TypeScript:

```typescript
// utils/dateFormatter.ts

/**
 * Огноог монгол форматаар харуулах
 * Жишээ: "2025-12-17T10:30:00Z" → "2025 оны 12 сарын 17, 10:30"
 */
export const formatDateMN = (dateString: string | Date): string => {
  if (!dateString) return 'Огноо байхгүй';
  
  try {
    const date = new Date(dateString);
    
    // Invalid date шалгах
    if (isNaN(date.getTime())) {
      return 'Буруу огноо';
    }
    
    return date.toLocaleString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Огноо алдаатай';
  }
};

/**
 * Зөвхөн огноо (цаг минутгүй)
 * Жишээ: "2025 оны 12 сарын 17"
 */
export const formatDateOnlyMN = (dateString: string | Date): string => {
  if (!dateString) return 'Огноо байхгүй';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Буруу огноо';
    }
    
    return date.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return 'Огноо алдаатай';
  }
};

/**
 * Богино формат
 * Жишээ: "17/12/2025"
 */
export const formatDateShortMN = (dateString: string | Date): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Буруу огноо';
    }
    
    return date.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {
    return '-';
  }
};

/**
 * Харьцуулсан огноо (relative time)
 * Жишээ: "2 цагийн өмнө", "3 өдрийн өмнө"
 */
export const formatRelativeTimeMN = (dateString: string | Date): string => {
  if (!dateString) return 'Огноо байхгүй';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Яг одоо';
    if (diffMins < 60) return `${diffMins} минутын өмнө`;
    if (diffHours < 24) return `${diffHours} цагийн өмнө`;
    if (diffDays < 30) return `${diffDays} өдрийн өмнө`;
    
    return formatDateOnlyMN(date);
  } catch (error) {
    return 'Огноо алдаатай';
  }
};

/**
 * Цаг минут
 * Жишээ: "10:30"
 */
export const formatTimeMN = (dateString: string | Date): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    return date.toLocaleTimeString('mn-MN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return '-';
  }
};
```

---

## 2. Orders Table дээр ашиглах

### React:

```typescript
// OrdersTable.tsx
import { formatDateMN, formatDateShortMN } from '../utils/dateFormatter';

interface Order {
  id: number;
  orderDate: string;
  createdBy: {
    name: string;
  };
  // ... бусад талбарууд
}

const OrdersTable = ({ orders }: { orders: Order[] }) => {
  return (
    <table className="orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total Amount</th>
          <th>Status</th>
          <th>Created By</th>
          <th>Created At</th>  {/* Огноо */}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>#{order.id}</td>
            <td>{order.customer?.name}</td>
            <td>₮{order.totalAmount}</td>
            <td>{order.status}</td>
            <td>{order.createdBy?.name || 'N/A'}</td>
            
            {/* ✅ Огноо харуулах */}
            <td>
              <div className="date-cell">
                <div className="date">
                  {formatDateShortMN(order.orderDate)}
                </div>
                <div className="time">
                  {formatTimeMN(order.orderDate)}
                </div>
              </div>
            </td>
            
            <td>
              <button onClick={() => viewOrder(order.id)}>Үзэх</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
```

### Vue.js:

```vue
<template>
  <table class="orders-table">
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Customer</th>
        <th>Total Amount</th>
        <th>Status</th>
        <th>Created By</th>
        <th>Created At</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>#{{ order.id }}</td>
        <td>{{ order.customer?.name }}</td>
        <td>₮{{ order.totalAmount }}</td>
        <td>{{ order.status }}</td>
        <td>{{ order.createdBy?.name || 'N/A' }}</td>
        
        <!-- ✅ Огноо харуулах -->
        <td>
          <div class="date-cell">
            <div class="date">{{ formatDateShort(order.orderDate) }}</div>
            <div class="time">{{ formatTime(order.orderDate) }}</div>
          </div>
        </td>
        
        <td>
          <button @click="viewOrder(order.id)">Үзэх</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { formatDateShortMN, formatTimeMN } from '@/utils/dateFormatter';

interface Order {
  id: number;
  orderDate: string;
  customer: { name: string };
  createdBy: { name: string };
  totalAmount: number;
  status: string;
}

const props = defineProps<{
  orders: Order[];
}>();

const formatDateShort = (date: string) => formatDateShortMN(date);
const formatTime = (date: string) => formatTimeMN(date);
</script>

<style scoped>
.date-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date {
  font-weight: 500;
  color: #2d3748;
}

.time {
  font-size: 12px;
  color: #718096;
}
</style>
```

---

## 3. Order Details Modal

### React:

```typescript
// OrderDetailsModal.tsx
import { formatDateMN, formatRelativeTimeMN } from '../utils/dateFormatter';

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-header">
        <h2>Захиалга #{order.id} - Дэлгэрэнгүй</h2>
        <button onClick={onClose}>×</button>
      </div>
      
      <div className="modal-body">
        {/* Огноо мэдээлэл */}
        <section className="info-section">
          <h3>Огноо мэдээлэл</h3>
          
          <div className="info-row">
            <span className="label">Үүсгэсэн огноо:</span>
            <span className="value">
              {formatDateMN(order.orderDate)}
            </span>
          </div>
          
          <div className="info-row">
            <span className="label">Хугацаа:</span>
            <span className="value">
              {formatRelativeTimeMN(order.orderDate)}
            </span>
          </div>
          
          {order.deliveryDate && (
            <div className="info-row">
              <span className="label">Хүргэх огноо:</span>
              <span className="value">
                {formatDateMN(order.deliveryDate)}
              </span>
            </div>
          )}
        </section>
        
        {/* Бусад мэдээлэл */}
        {/* ... */}
      </div>
    </div>
  );
};
```

---

## 4. CSS Styling

```css
/* DateCell.css */

.date-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
}

.date-cell .date {
  font-weight: 500;
  font-size: 14px;
  color: #2d3748;
}

.date-cell .time {
  font-size: 12px;
  color: #718096;
}

/* Info section */
.info-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  font-weight: 500;
  color: #4a5568;
}

.info-row .value {
  color: #2d3748;
}
```

---

## 5. React Hook (Custom Hook)

```typescript
// hooks/useDateFormat.ts

import { useMemo } from 'react';
import { formatDateMN, formatDateShortMN, formatRelativeTimeMN } from '../utils/dateFormatter';

export const useDateFormat = (dateString: string | Date) => {
  const formatted = useMemo(() => {
    return {
      full: formatDateMN(dateString),
      short: formatDateShortMN(dateString),
      relative: formatRelativeTimeMN(dateString),
    };
  }, [dateString]);
  
  return formatted;
};

// Ашиглах:
const OrderRow = ({ order }) => {
  const date = useDateFormat(order.orderDate);
  
  return (
    <tr>
      <td>{date.short}</td>
      <td title={date.full}>{date.relative}</td>
    </tr>
  );
};
```

---

## 6. Moment.js ашиглах (Илүү олон боломж)

### Суулгах:

```bash
npm install moment
# эсвэл
npm install dayjs  # Хөнгөн хувилбар
```

### Moment.js:

```typescript
// utils/dateFormatter.ts
import moment from 'moment';
import 'moment/locale/mn';  // Монгол хэл

moment.locale('mn');

export const formatDateMN = (dateString: string): string => {
  if (!dateString) return 'Огноо байхгүй';
  return moment(dateString).format('YYYY оны MM сарын DD, HH:mm');
};

export const formatDateShortMN = (dateString: string): string => {
  if (!dateString) return '-';
  return moment(dateString).format('DD/MM/YYYY');
};

export const formatRelativeTimeMN = (dateString: string): string => {
  if (!dateString) return 'Огноо байхгүй';
  return moment(dateString).fromNow();  // "2 цагийн өмнө"
};
```

### Day.js (Хөнгөн):

```typescript
// utils/dateFormatter.ts
import dayjs from 'dayjs';
import 'dayjs/locale/mn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('mn');
dayjs.extend(relativeTime);

export const formatDateMN = (dateString: string): string => {
  if (!dateString) return 'Огноо байхгүй';
  return dayjs(dateString).format('YYYY оны MM сарын DD, HH:mm');
};

export const formatRelativeTimeMN = (dateString: string): string => {
  if (!dateString) return 'Огноо байхгүй';
  return dayjs(dateString).fromNow();
};
```

---

## 7. Бүрэн жишээ (React Component)

```typescript
// OrdersPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDateShortMN, formatTimeMN, formatRelativeTimeMN } from '../utils/dateFormatter';

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  customer: { name: string };
  createdBy: { name: string; role: { name: string } };
  totalAmount: number;
  status: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { limit: 100 },
        });
        
        setOrders(response.data.data.orders);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Уншиж байна...</div>;

  return (
    <div className="orders-page">
      <h1>Захиалга ({orders.length})</h1>
      
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Дугаар</th>
            <th>Харилцагч</th>
            <th>Дүн</th>
            <th>Төлөв</th>
            <th>Үүсгэсэн</th>
            <th>Огноо</th>
            <th>Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.orderNumber}</td>
              <td>{order.customer.name}</td>
              <td>₮{order.totalAmount}</td>
              <td>
                <span className={`status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <div className="created-by">
                  <div>{order.createdBy.name}</div>
                  <small>{order.createdBy.role.name}</small>
                </div>
              </td>
              <td>
                <div className="date-cell">
                  <div className="date">{formatDateShortMN(order.orderDate)}</div>
                  <div className="time">{formatTimeMN(order.orderDate)}</div>
                  <div className="relative">{formatRelativeTimeMN(order.orderDate)}</div>
                </div>
              </td>
              <td>
                <button onClick={() => console.log('View', order.id)}>
                  Үзэх
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
```

---

## 8. TypeScript Type

```typescript
// types/date.ts

export type DateFormatType = 'full' | 'short' | 'relative' | 'time';

export interface DateFormatterOptions {
  format?: DateFormatType;
  locale?: string;
  fallback?: string;
}
```

---

## 📝 Хураангуй

### Utility функцүүд:
- ✅ `formatDateMN()` - Бүтэн огноо + цаг
- ✅ `formatDateOnlyMN()` - Зөвхөн огноо
- ✅ `formatDateShortMN()` - Богино формат
- ✅ `formatTimeMN()` - Зөвхөн цаг
- ✅ `formatRelativeTimeMN()` - "2 цагийн өмнө"

### Ашиглах газрууд:
- ✅ Orders table
- ✅ Order details modal
- ✅ Dashboard
- ✅ Reports

### Санал:
1. **Энгийн төсөл:** JavaScript native `toLocaleString()`
2. **Том төсөл:** Day.js эсвэл Moment.js

---

**Амжилт хүсье! 📅🚀**

