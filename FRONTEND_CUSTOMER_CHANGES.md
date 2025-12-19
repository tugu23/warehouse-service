# Frontend-д Хийх Өөрчлөлтүүд - Харилцагчийн Шинэ Талбарууд

## 📋 Тойм

Backend API дээр харилцагчийн 4 шинэ талбар нэмэгдсэн. Frontend дээр эдгээр талбаруудыг харуулж, засварлах боломжтой болгох шаардлагатай.

## 🆕 Нэмэгдсэн Талбарууд

| Талбар | Төрөл | Тайлбар | Заавал эсэх |
|--------|-------|---------|-------------|
| `realName` | string \| null | Жинхэнэ нэр | Optional |
| `name2` | string \| null | Хоёр дахь нэр | Optional |
| `legacyCustomerId` | number \| null | Хуучин системийн ID | Optional |
| `direction` | string \| null | Чиглэл/Зүг | Optional |

**Өмнөөс байсан чухал талбар:**
- `registrationNumber` - **Байгууллагын регистр** (одоо харагдах ёстой)

---

## 1️⃣ TypeScript Types/Interfaces Шинэчлэх

### Файл: `types/customer.ts` эсвэл `interfaces/customer.interface.ts`

```typescript
export interface Customer {
  id: number;
  name: string;
  
  // 🆕 ШИНЭ ТАЛБАРУУД
  realName?: string | null;
  name2?: string | null;
  legacyCustomerId?: number | null;
  direction?: string | null;
  
  // Өмнөх талбарууд
  organizationName?: string | null;
  organizationType?: string | null;
  contactPersonName?: string | null;
  registrationNumber?: string | null;  // ⭐ Байгууллагын регистр
  address?: string | null;
  district?: string | null;
  detailedAddress?: string | null;
  phoneNumber?: string | null;
  isVatPayer: boolean;
  paymentTerms?: string | null;
  locationLatitude?: number | null;
  locationLongitude?: number | null;
  customerTypeId?: number | null;
  assignedAgentId?: number | null;
  
  // Холбоотой өгөгдөл
  customerType?: CustomerType;
  assignedAgent?: Agent;
}

// Create/Update-д ашиглах
export interface CustomerFormData {
  name: string;
  realName?: string;
  name2?: string;
  legacyCustomerId?: number;
  organizationName?: string;
  registrationNumber?: string;
  phoneNumber?: string;
  address?: string;
  district?: string;
  isVatPayer?: boolean;
  paymentTerms?: string;
  direction?: string;
  customerTypeId?: number;
  assignedAgentId?: number;
}
```

---

## 2️⃣ Харилцагчийн Жагсаалт (Customer List/Table)

### React Example:

```tsx
// components/CustomerTable.tsx
import React from 'react';
import { Customer } from '../types/customer';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ 
  customers, 
  onEdit 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Нэр
            </th>
            {/* 🆕 Шинэ багана */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Жинхэнэ нэр
            </th>
            {/* ⭐ Регистр багана */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Регистр
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Утас
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Дүүрэг
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              НӨАТ
            </th>
            {/* 🆕 Шинэ багана */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Чиглэл
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Үйлдэл
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {customer.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {customer.name}
                </div>
                {/* 🆕 name2 жижиг текстээр */}
                {customer.name2 && (
                  <div className="text-xs text-gray-500">
                    {customer.name2}
                  </div>
                )}
              </td>
              {/* 🆕 Жинхэнэ нэр */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {customer.realName || '-'}
              </td>
              {/* ⭐ Байгууллагын регистр */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {customer.registrationNumber ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {customer.registrationNumber}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {customer.phoneNumber || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {customer.district || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {customer.isVatPayer ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Тийм
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Үгүй
                  </span>
                )}
              </td>
              {/* 🆕 Чиглэл */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {customer.direction || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(customer)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Засах
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### Vue.js Example:

```vue
<!-- components/CustomerTable.vue -->
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Нэр</th>
          <!-- 🆕 Шинэ багана -->
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Жинхэнэ нэр</th>
          <!-- ⭐ Регистр багана -->
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Регистр</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Утас</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">НӨАТ</th>
          <!-- 🆕 Чиглэл -->
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Чиглэл</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Үйлдэл</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm">{{ customer.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
            <!-- 🆕 name2 -->
            <div v-if="customer.name2" class="text-xs text-gray-500">{{ customer.name2 }}</div>
          </td>
          <!-- 🆕 Жинхэнэ нэр -->
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ customer.realName || '-' }}
          </td>
          <!-- ⭐ Регистр -->
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span v-if="customer.registrationNumber" 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              {{ customer.registrationNumber }}
            </span>
            <span v-else class="text-gray-400">-</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ customer.phoneNumber || '-' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="customer.isVatPayer ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
              {{ customer.isVatPayer ? 'Тийм' : 'Үгүй' }}
            </span>
          </td>
          <!-- 🆕 Чиглэл -->
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ customer.direction || '-' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button @click="$emit('edit', customer)" class="text-indigo-600 hover:text-indigo-900">
              Засах
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { Customer } from '@/types/customer';

defineProps<{
  customers: Customer[];
}>();

defineEmits<{
  edit: [customer: Customer];
}>();
</script>
```

---

## 3️⃣ Харилцагч Үүсгэх/Засах Form

### React Example:

```tsx
// components/CustomerForm.tsx
import React, { useState } from 'react';
import { CustomerFormData } from '../types/customer';

interface CustomerFormProps {
  initialData?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CustomerFormData>(
    initialData || {
      name: '',
      isVatPayer: false,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof CustomerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Үндсэн мэдээлэл */}
        <div className="col-span-2 border-b pb-4">
          <h3 className="text-lg font-medium text-gray-900">Үндсэн мэдээлэл</h3>
        </div>

        {/* Нэр - Заавал */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Нэр <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* 🆕 Жинхэнэ нэр */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Жинхэнэ нэр
          </label>
          <input
            type="text"
            value={formData.realName || ''}
            onChange={(e) => handleChange('realName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* 🆕 Хоёр дахь нэр */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Хоёр дахь нэр
          </label>
          <input
            type="text"
            value={formData.name2 || ''}
            onChange={(e) => handleChange('name2', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Байгууллагын мэдээлэл */}
        <div className="col-span-2 border-b pb-4 mt-4">
          <h3 className="text-lg font-medium text-gray-900">Байгууллагын мэдээлэл</h3>
        </div>

        {/* Байгууллагын нэр */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Байгууллагын нэр
          </label>
          <input
            type="text"
            value={formData.organizationName || ''}
            onChange={(e) => handleChange('organizationName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* ⭐ Байгууллагын регистр */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Байгууллагын регистр <span className="text-blue-500">⭐</span>
          </label>
          <input
            type="text"
            value={formData.registrationNumber || ''}
            onChange={(e) => handleChange('registrationNumber', e.target.value)}
            placeholder="1234567"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Байгууллагын регистрийн дугаар
          </p>
        </div>

        {/* НӨАТ төлөгч эсэх */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isVatPayer || false}
            onChange={(e) => handleChange('isVatPayer', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 block text-sm text-gray-900">
            НӨАТ төлөгч
          </label>
        </div>

        {/* Холбоо барих мэдээлэл */}
        <div className="col-span-2 border-b pb-4 mt-4">
          <h3 className="text-lg font-medium text-gray-900">Холбоо барих</h3>
        </div>

        {/* Утасны дугаар */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Утасны дугаар
          </label>
          <input
            type="tel"
            value={formData.phoneNumber || ''}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="99999999"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Хаяг */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Хаяг
          </label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Дүүрэг */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Дүүрэг
          </label>
          <input
            type="text"
            value={formData.district || ''}
            onChange={(e) => handleChange('district', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* 🆕 Чиглэл/Зүг */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Чиглэл/Зүг
          </label>
          <select
            value={formData.direction || ''}
            onChange={(e) => handleChange('direction', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Сонгоно уу</option>
            <option value="Зүүн зүг">Зүүн зүг</option>
            <option value="Баруун зүг">Баруун зүг</option>
            <option value="Өмнөд зүг">Өмнөд зүг</option>
            <option value="Хойд зүг">Хойд зүг</option>
            <option value="Зүг оруулаагүй байна">Зүг оруулаагүй байна</option>
          </select>
        </div>

        {/* Төлбөрийн нөхцөл */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Төлбөрийн нөхцөл
          </label>
          <select
            value={formData.paymentTerms || ''}
            onChange={(e) => handleChange('paymentTerms', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Сонгоно уу</option>
            <option value="Бэлэн">Бэлэн</option>
            <option value="Зээл">Зээл</option>
            <option value="Данс">Данс</option>
          </select>
        </div>

        {/* 🆕 Legacy ID (зөвхөн харуулах, засах боломжгүй) */}
        {initialData?.legacyCustomerId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Хуучин системийн ID
            </label>
            <input
              type="text"
              value={initialData.legacyCustomerId}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        )}
      </div>

      {/* Товчнууд */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Цуцлах
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Хадгалах
        </button>
      </div>
    </form>
  );
};
```

---

## 4️⃣ Харилцагчийн Дэлгэрэнгүй (Customer Detail View)

```tsx
// components/CustomerDetail.tsx
import React from 'react';
import { Customer } from '../types/customer';

interface CustomerDetailProps {
  customer: Customer;
  onEdit: () => void;
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ 
  customer, 
  onEdit 
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {customer.name}
          </h3>
          {/* 🆕 name2 */}
          {customer.name2 && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {customer.name2}
            </p>
          )}
        </div>
        <button
          onClick={onEdit}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Засах
        </button>
      </div>

      <div className="border-t border-gray-200">
        <dl>
          {/* ID */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              #{customer.id}
            </dd>
          </div>

          {/* 🆕 Жинхэнэ нэр */}
          {customer.realName && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Жинхэнэ нэр</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.realName}
              </dd>
            </div>
          )}

          {/* ⭐ Байгууллагын регистр */}
          {customer.registrationNumber && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Байгууллагын регистр
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {customer.registrationNumber}
                </span>
              </dd>
            </div>
          )}

          {/* Утасны дугаар */}
          {customer.phoneNumber && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Утас</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.phoneNumber}
              </dd>
            </div>
          )}

          {/* НӨАТ төлөгч */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">НӨАТ төлөгч</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                customer.isVatPayer 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {customer.isVatPayer ? 'Тийм' : 'Үгүй'}
              </span>
            </dd>
          </div>

          {/* 🆕 Чиглэл */}
          {customer.direction && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Чиглэл</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.direction}
              </dd>
            </div>
          )}

          {/* 🆕 Legacy ID */}
          {customer.legacyCustomerId && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Хуучин системийн ID
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.legacyCustomerId}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
```

---

## 5️⃣ API Service Functions

```typescript
// services/customerService.ts
import axios from 'axios';
import { Customer, CustomerFormData } from '../types/customer';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const customerService = {
  // Бүх харилцагч авах
  async getAll(params?: {
    search?: string;
    district?: string;
    registrationNumber?: string;
    isVatPayer?: boolean;
  }): Promise<Customer[]> {
    const response = await axios.get(`${API_URL}/customers`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.data.customers;
  },

  // ID-аар харилцагч авах
  async getById(id: number): Promise<Customer> {
    const response = await axios.get(`${API_URL}/customers/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.data.customer;
  },

  // Шинэ харилцагч үүсгэх
  async create(data: CustomerFormData): Promise<Customer> {
    const response = await axios.post(`${API_URL}/customers`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.data.customer;
  },

  // Харилцагч шинэчлэх
  async update(id: number, data: Partial<CustomerFormData>): Promise<Customer> {
    const response = await axios.put(`${API_URL}/customers/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.data.customer;
  },
};
```

---

## 6️⃣ Шүүлт/Хайлт (Filter/Search)

```tsx
// components/CustomerFilters.tsx
import React, { useState } from 'react';

interface CustomerFiltersProps {
  onFilter: (filters: FilterState) => void;
}

interface FilterState {
  search: string;
  district: string;
  registrationNumber: string;
  isVatPayer: string;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    district: '',
    registrationNumber: '',
    isVatPayer: '',
  });

  const handleChange = (field: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Хайлт */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Хайх
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Нэр, утас, регистр..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Нэр, жинхэнэ нэр, name2, регистр, утасаар хайна
          </p>
        </div>

        {/* Дүүрэг */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дүүрэг
          </label>
          <input
            type="text"
            value={filters.district}
            onChange={(e) => handleChange('district', e.target.value)}
            placeholder="Дүүрэг"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* ⭐ Регистрийн дугаар */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Регистрийн дугаар
          </label>
          <input
            type="text"
            value={filters.registrationNumber}
            onChange={(e) => handleChange('registrationNumber', e.target.value)}
            placeholder="1234567"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* НӨАТ төлөгч */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            НӨАТ төлөгч
          </label>
          <select
            value={filters.isVatPayer}
            onChange={(e) => handleChange('isVatPayer', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Бүгд</option>
            <option value="true">Тийм</option>
            <option value="false">Үгүй</option>
          </select>
        </div>
      </div>
    </div>
  );
};
```

---

## 7️⃣ Өөрчлөлтийн Хураангуй

### ✅ Шинэчлэх Хэрэгтэй Файлууд:

1. **Types/Interfaces** - `Customer` interface-д 4 шинэ талбар нэмэх
2. **Table Component** - Шинэ багануудыг харуулах
3. **Form Component** - Шинэ input-ууд нэмэх
4. **Detail View** - Шинэ талбаруудыг харуулах
5. **API Service** - Өөрчлөлт хэрэггүй (backend автоматаар буцаана)
6. **Filter Component** - Регистрээр шүүх боломж нэмэх

### 🎯 Анхаарах Зүйлс:

1. **`registrationNumber`** (Байгууллагын регистр) - Хамгийн чухал талбар, онцлон харуулах
2. **`realName` болон `name2`** - Хайлтад нэмэгдсэн, хоёуланг нь харуулах
3. **`legacyCustomerId`** - Зөвхөн харуулах, засах боломжгүй
4. **`direction`** - Select dropdown-оор сонголт өгөх

### 📱 Mobile Responsive:

```css
/* Жижиг дэлгэцэнд */
@media (max-width: 768px) {
  /* Зарим багана нуух */
  .hide-on-mobile {
    display: none;
  }
  
  /* Grid layout өөрчлөх */
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
```

---

## ✅ Чек Лист

- [ ] TypeScript types/interfaces шинэчилсэн
- [ ] Customer table-д шинэ багануудыг нэмсэн
- [ ] Customer form-д шинэ input-ууд нэмсэн
- [ ] Customer detail view шинэчилсэн
- [ ] Хайлт/Filter функцүүд шинэчилсэн
- [ ] Mobile responsive дизайн шалгасан
- [ ] Регистрийн дугаар тодорхой харагдаж байгааг шалгасан

---

**Backend API бэлэн байна, frontend team integration хийх боломжтой!** 🚀

