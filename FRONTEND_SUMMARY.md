# Frontend Өөрчлөлтийн Хураангуй

## 🎯 Юу хийх хэрэгтэй вэ?

Backend API дээр харилцагчийн **4 шинэ талбар** нэмэгдсэн. Frontend-д эдгээрийг харуулах, засах боломжтой болгох шаардлагатай.

---

## 🆕 Нэмэгдсэн Талбарууд

| # | Талбар | Төрөл | Тайлбар |
|---|--------|-------|---------|
| 1 | `realName` | string? | Жинхэнэ нэр |
| 2 | `name2` | string? | Хоёр дахь нэр |
| 3 | `legacyCustomerId` | number? | Хуучин системийн ID |
| 4 | `direction` | string? | Чиглэл/Зүг |

**Чухал:** `registrationNumber` (Байгууллагын регистр) өмнөөс байсан ч одоо онцлон харуулах хэрэгтэй! ⭐

---

## ✅ Frontend-д Хийх 7 Ажил

### 1️⃣ TypeScript Types Шинэчлэх

```typescript
// types/customer.ts
export interface Customer {
  id: number;
  name: string;
  realName?: string | null;           // 🆕
  name2?: string | null;              // 🆕
  legacyCustomerId?: number | null;   // 🆕
  direction?: string | null;          // 🆕
  registrationNumber?: string | null; // ⭐ Регистр
  // ... бусад талбарууд
}
```

### 2️⃣ Customer Table - Багануудыг Нэмэх

**Нэмэх багануудх:**
- Жинхэнэ нэр (`realName`)
- **Регистр** (`registrationNumber`) - онцлон харуулах
- Чиглэл (`direction`)
- `name2`-ыг үндсэн нэрийн доор жижиг текстээр

```tsx
<th>Регистр</th>  {/* ⭐ Шинэ багана */}
<th>Жинхэнэ нэр</th>  {/* 🆕 */}
<th>Чиглэл</th>  {/* 🆕 */}
```

### 3️⃣ Customer Form - Input-ууд Нэмэх

**Нэмэх input-ууд:**
```tsx
<input name="realName" placeholder="Жинхэнэ нэр" />
<input name="name2" placeholder="Хоёр дахь нэр" />
<input name="registrationNumber" placeholder="Регистр" />  {/* ⭐ */}
<select name="direction">
  <option>Зүүн зүг</option>
  <option>Баруун зүг</option>
  <option>Зүг оруулаагүй байна</option>
</select>
```

### 4️⃣ Customer Detail View - Дэлгэрэнгүй Харуулах

```tsx
{customer.realName && <div>Жинхэнэ нэр: {customer.realName}</div>}
{customer.registrationNumber && (
  <div className="badge">Регистр: {customer.registrationNumber}</div>
)}
{customer.direction && <div>Чиглэл: {customer.direction}</div>}
```

### 5️⃣ Search/Filter - Хайлт Сайжруулах

Backend хайлт одоо дараах талбаруудаар ажиллана:
- `name` ✅
- `realName` 🆕
- `name2` 🆕
- `organizationName` ✅
- `registrationNumber` ⭐
- `phoneNumber` ✅

```tsx
<input 
  placeholder="Нэр, жинхэнэ нэр, регистр, утасаар хайна уу..."
  onChange={handleSearch}
/>
```

### 6️⃣ Registration Number Filter - Регистрээр Шүүх

```tsx
<input
  name="registrationNumber"
  placeholder="Регистрийн дугаар"
  onChange={handleFilter}
/>
```

### 7️⃣ API - Өөрчлөлт Хэрэггүй

Backend автоматаар бүх талбаруудыг буцаана. API service код өөрчлөх шаардлагагүй!

```typescript
// ✅ Ингээд л хангалттай
const customers = await customerService.getAll();
// Response автоматаар бүх шинэ талбарууд агуулна
```

---

## 📋 UI/UX Зөвлөмж

### Регистрийн дугаар (⭐ Хамгийн чухал)

```tsx
{/* Badge style-аар онцлох */}
{customer.registrationNumber && (
  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
    {customer.registrationNumber}
  </span>
)}
```

### НӨАТ төлөгч + Регистр хамтад

```tsx
<div className="flex items-center gap-2">
  {customer.registrationNumber && (
    <span className="badge badge-blue">
      {customer.registrationNumber}
    </span>
  )}
  {customer.isVatPayer && (
    <span className="badge badge-green">НӨАТ</span>
  )}
</div>
```

### name2 - жижиг текст

```tsx
<div>
  <div className="font-semibold">{customer.name}</div>
  {customer.name2 && (
    <div className="text-xs text-gray-500">{customer.name2}</div>
  )}
</div>
```

---

## 🧪 Тест Хийх

### API Endpoints:

```bash
# Бүх харилцагч (шинэ талбаруудтай)
GET /api/customers

# Регистрээр хайх
GET /api/customers?registrationNumber=5003059

# Ерөнхий хайлт (realName, name2-оор хайна)
GET /api/customers?search=жинхэнэ
```

### Response Жишээ:

```json
{
  "status": "success",
  "data": {
    "customers": [
      {
        "id": 8,
        "name": "10 со хүнс сөүл88",
        "realName": null,
        "name2": null,
        "legacyCustomerId": null,
        "registrationNumber": "5003059",
        "phoneNumber": null,
        "isVatPayer": true,
        "direction": null,
        "customerType": {...},
        "assignedAgent": {...}
      }
    ]
  }
}
```

---

## ✅ Чек Лист

Дараах зүйлсийг frontend дээр хийх хэрэгтэй:

- [ ] `Customer` interface-д 4 шинэ талбар нэмэх
- [ ] Table-д **Регистр** багана нэмж, онцлон харуулах
- [ ] Table-д Жинхэнэ нэр, Чиглэл багануудыг нэмэх
- [ ] Form-д шинэ input талбаруудыг нэмэх
- [ ] Detail view дээр шинэ талбаруудыг харуулах
- [ ] Хайлтын placeholder текст өөрчлөх
- [ ] Регистрээр шүүх filter нэмэх
- [ ] Mobile responsive шалгах
- [ ] API integration тест хийх

---

## 📁 Дэлгэрэнгүй Баримт

**`FRONTEND_CUSTOMER_CHANGES.md`** файлд:
- ✅ Бүрэн React код жишээ
- ✅ Vue.js код жишээ  
- ✅ TypeScript types
- ✅ Form validation
- ✅ API service functions
- ✅ Responsive дизайн
- ✅ UI/UX best practices

---

## 🎉 Дүгнэлт

**Backend бэлэн!** ✅
- 4 шинэ талбар нэмэгдсэн
- Migration амжилттай
- 3,540 харилцагч бүрэн мэдээлэлтэй
- Регистрийн дугаар харагдаж байна

**Frontend integration эхлүүлж болно!** 🚀

---

**Асуулт байвал:** `FRONTEND_CUSTOMER_CHANGES.md` дэлгэрэнгүй заавар харна уу.

