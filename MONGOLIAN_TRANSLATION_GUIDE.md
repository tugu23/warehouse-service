# 🇲🇳 Монгол хэл дээрх орчуулгын гарын авлага

## Тойм

Энэхүү систем нь Warehouse Service API-ийн бүх хариу болон алдааны мэдээллийг монгол хэлээр харуулахад зориулагдсан.

## Хэрхэн ажилладаг вэ?

### 1. Анхдагч хэл: **Монгол**

Систем автоматаар **монгол хэлийг** анхдагч хэл болгон ашигладаг. Энэ нь бүх API хариунууд анхнаасаа монгол хэл дээр харагдана гэсэн үг.

### 2. Хэлний сонголт

Хэрэглэгч HTTP хүсэлтийн header-д хэлний мэдээллийг дараах байдлаар илгээж болно:

```http
Accept-Language: mn  # Монгол
Accept-Language: en  # Англи
```

Хэрэв хэл заагаагүй бол автоматаар **монгол хэл** хэрэглэгдэнэ.

## Файлын бүтэц

### 1. Translation файлууд

**`src/i18n/translations.ts`** - Бүх орчуулгын текстүүд:
- Монгол орчуулга (`mn`)
- Англи орчуулга (`en`)

### 2. Language utility

**`src/i18n/index.ts`** - Хэлний функцүүд:
- `getLanguage(req)` - Request-оос хэл олж авах
- `getTranslations(lang)` - Тодорхой хэлний орчуулга авах
- `t(req)` - Request-ийн орчуулга авах

### 3. Language middleware

**`src/middleware/language.middleware.ts`** - Автоматаар request-д орчуулга нэмнэ

## Орчуулгын ангилал

### Authentication (Нэвтрэх систем)
```typescript
auth: {
  invalidCredentials: 'Нэвтрэх нэр эсвэл нууц үг буруу байна',
  accountDeactivated: 'Таны данс идэвхгүй болсон байна',
  loginSuccess: 'Амжилттай нэвтэрлээ',
  unauthorized: 'Нэвтрэх шаардлагатай',
  forbidden: 'Хандах эрх хүрэлцэхгүй байна',
  // ...
}
```

### Products (Бараа)
```typescript
products: {
  created: 'Бараа амжилттай үүсгэлээ',
  updated: 'Барааны мэдээлэл шинэчлэгдлээ',
  notFound: 'Бараа олдсонгүй',
  codeExists: 'Энэ кодтой бараа аль хэдийн бүртгэгдсэн байна',
  insufficientStock: 'Барааны үлдэгдэл хүрэлцэхгүй байна',
  // ...
}
```

### Orders (Захиалга)
```typescript
orders: {
  created: 'Захиалга амжилттай үүсгэлээ',
  updated: 'Захиалга шинэчлэгдлээ',
  notFound: 'Захиалга олдсонгүй',
  statusUpdated: 'Захиалгын төлөв өөрчлөгдлөө',
  noItems: 'Захиалгад бараа байхгүй байна',
  // ...
}
```

### Customers (Харилцагч)
```typescript
customers: {
  created: 'Харилцагч амжилттай үүсгэлээ',
  updated: 'Харилцагчийн мэдээлэл шинэчлэгдлээ',
  notFound: 'Харилцагч олдсонгүй',
  // ...
}
```

### Payments (Төлбөр)
```typescript
payments: {
  created: 'Төлбөр амжилттай бүртгэгдлээ',
  updated: 'Төлбөрийн мэдээлэл шинэчлэгдлээ',
  notFound: 'Төлбөр олдсонгүй',
  invalidAmount: 'Төлбөрийн дүн буруу байна',
  // ...
}
```

### Төлбөрийн хэлбэр
```typescript
paymentMethod: {
  Cash: 'Бэлэн',
  Card: 'Карт',
  BankTransfer: 'Шилжүүлэг',
  Credit: 'Зээл',
  QR: 'QR',
  Mobile: 'Гар утас',
}
```

### Захиалгын төлөв
```typescript
orderStatus: {
  Pending: 'Хүлээгдэж буй',
  Fulfilled: 'Биелсэн',
  Cancelled: 'Цуцлагдсан',
  Delivered: 'Хүргэгдсэн',
}
```

## Хэрхэн ашиглах вэ?

### Controller-д орчуулга ашиглах

```typescript
import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/error.middleware";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req.t ашиглан орчуулга авах
    if (!product) {
      throw new AppError(req.t.products.notFound, 404);
    }

    res.status(201).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};
```

### Шинэ орчуулга нэмэх

1. **`src/i18n/translations.ts`** файлд очоод монгол болон англи орчуулга нэмнэ:

```typescript
export const mn: Translations = {
  // ... бусад орчуулга
  newCategory: {
    created: 'Шинэ зүйл амжилттай үүсгэлээ',
    error: 'Алдаа гарлаа',
  },
};

export const en: Translations = {
  // ... other translations
  newCategory: {
    created: 'New item created successfully',
    error: 'Error occurred',
  },
};
```

2. **Translations interface**-д type нэмнэ:

```typescript
export interface Translations {
  // ... бусад types
  newCategory: {
    created: string;
    error: string;
  };
}
```

3. Controller-д ашиглах:

```typescript
throw new AppError(req.t.newCategory.error, 400);
```

## API Response жишээнүүд

### Амжилттай хариу (Монгол хэл)
```json
{
  "status": "success",
  "data": {
    "product": { ... }
  }
}
```

### Алдааны хариу (Монгол хэл)
```json
{
  "status": "error",
  "message": "Бараа олдсонгүй"
}
```

### Алдааны хариу (Англи хэл, Accept-Language: en)
```json
{
  "status": "error",
  "message": "Product not found"
}
```

## Frontend-ийн интеграци

### React/TypeScript жишээ

```typescript
import axios from 'axios';

// Монгол хэлээр хүсэлт илгээх
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept-Language': 'mn',  // Монгол хэл
  },
});

// Англи хэлээр хүсэлт илгээх
const apiEn = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept-Language': 'en',  // Англи хэл
  },
});

// Ашиглах
try {
  const response = await api.get('/products');
  console.log(response.data);
} catch (error) {
  // Алдаа монгол хэл дээр гарна
  console.error(error.response.data.message);
}
```

### Vue.js жишээ

```javascript
// plugins/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Accept-Language': 'mn', // Монгол хэл
  },
});

export default apiClient;
```

### jQuery жишээ

```javascript
$.ajax({
  url: 'http://localhost:3000/api/products',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Accept-Language': 'mn', // Монгол хэл
  },
  success: function(data) {
    console.log(data);
  },
  error: function(xhr) {
    // Алдаа монгол хэл дээр гарна
    alert(xhr.responseJSON.message);
  }
});
```

## Тестлэх

### cURL ашиглах

```bash
# Монгол хэлээр (анхдагч)
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# Англи хэлээр
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept-Language: en"

# Монгол хэлээр (тодорхой заасан)
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept-Language: mn"
```

### Postman ашиглах

1. Request Headers-д очих
2. Key: `Accept-Language`
3. Value: `mn` эсвэл `en`
4. Send дарж тест хийх

## Давуу тал

✅ **Автоматаар монгол хэл дээр** - Тохиргоо шаардлагагүй  
✅ **Хялбар ашиглалт** - `req.t.category.message` гэж л бичнэ  
✅ **Type safety** - TypeScript автоматаар алдаа шалгана  
✅ **Хэлбэр нэмэхэд хялбар** - Зөвхөн translations.ts-д нэмнэ  
✅ **Бүх controller-т идэвхтэй** - Бүх API хариунууд монголоор  
✅ **Frontend-тэй амархан холбогдох** - Accept-Language header ашиглана  

## Асуулт хариулт

**Q: Яагаад монгол хэлийг анхдагч болгосон бэ?**  
A: Энэ нь Монгол улсад ашиглагдах систем учир хэрэглэгчдэд илүү ойлгомжтой байх болно.

**Q: Англи хэл дээр хэрхэн харуулах вэ?**  
A: HTTP header-д `Accept-Language: en` гэж нэмнэ.

**Q: Шинэ хэл нэмж болох уу?**  
A: Тийм, translations.ts файлд шинэ хэлний орчуулга нэмж, Language type-д нэмнэ.

**Q: Хэрхэн тест хийх вэ?**  
A: Server-ийг ажиллуулаад Postman эсвэл cURL ашиглан өөр өөр хэлээр хүсэлт илгээнэ.

## Дэмжлэг

Асуулт байвал development team-тэй холбогдоно уу.

---

**Амжилт хүсье! 🚀**

