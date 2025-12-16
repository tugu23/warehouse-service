# 🚀 Монгол хэлний дэмжлэг - Хурдан эхлэх

## Хурдан тест

### 1. Server ажиллуулах

```bash
npm run dev
```

### 2. Монгол хэлээр тест хийх

```bash
# Буруу нэвтрэх (Монгол хэлээр алдаа харагдана)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept-Language: mn" \
  -d '{"identifier":"wrong","password":"wrong"}'

# Хариу:
# {
#   "status": "error",
#   "message": "Нэвтрэх нэр эсвэл нууц үг буруу байна"
# }
```

### 3. Англи хэлээр тест хийх

```bash
# Буруу нэвтрэх (Англи хэлээр алдаа харагдана)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{"identifier":"wrong","password":"wrong"}'

# Response:
# {
#   "status": "error",
#   "message": "Invalid credentials"
# }
```

### 4. Автоматаар тест ажиллуулах

```bash
./test-mongolian.sh
```

## Хэрхэн ажилладаг вэ?

### Анхдагч хэл: Монгол

Хэрэв `Accept-Language` header заагаагүй бол автоматаар **монгол хэл** хэрэглэгдэнэ:

```bash
# Энэ нь монгол хэлээр хариу өгнө
curl http://localhost:3000/api/products/999 \
  -H "Authorization: Bearer TOKEN"

# Хариу: "Бараа олдсонгүй"
```

### Хэл солих

```bash
# Монгол хэл
curl http://localhost:3000/api/products/999 \
  -H "Authorization: Bearer TOKEN" \
  -H "Accept-Language: mn"

# Англи хэл
curl http://localhost:3000/api/products/999 \
  -H "Authorization: Bearer TOKEN" \
  -H "Accept-Language: en"
```

## Frontend интеграци

### React/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Accept-Language': 'mn',  // Монгол хэл
  },
});

// Ашиглах
try {
  const response = await api.get('/products');
} catch (error) {
  // Алдаа монгол хэл дээр гарна
  alert(error.response.data.message);
}
```

### Vue.js

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Accept-Language': 'mn',
  },
});

export default api;
```

### jQuery

```javascript
$.ajax({
  url: 'http://localhost:3000/api/products',
  headers: {
    'Accept-Language': 'mn',
  },
  success: function(data) {
    console.log(data);
  },
  error: function(xhr) {
    alert(xhr.responseJSON.message); // Монгол хэлээр
  }
});
```

## Жишээ хариунууд

### Амжилттай хариу

```json
{
  "status": "success",
  "data": {
    "products": [...]
  }
}
```

### Алдааны хариу (Монгол)

```json
{
  "status": "error",
  "message": "Бараа олдсонгүй"
}
```

### Алдааны хариу (Англи)

```json
{
  "status": "error",
  "message": "Product not found"
}
```

## Бүх орчуулга

### Authentication
- ❌ Нэвтрэх нэр эсвэл нууц үг буруу байна
- ❌ Таны данс идэвхгүй болсон байна
- ❌ Хандах эрх хүрэлцэхгүй байна

### Products
- ❌ Бараа олдсонгүй
- ❌ Барааны үлдэгдэл хүрэлцэхгүй байна
- ✅ Бараа амжилттай үүсгэлээ

### Orders
- ❌ Захиалга олдсонгүй
- ❌ Захиалгад бараа байхгүй байна
- ✅ Захиалга амжилттай үүсгэлээ

### Customers
- ❌ Харилцагч олдсонгүй
- ✅ Харилцагч амжилттай үүсгэлээ

### Төлбөрийн хэлбэр
- Бэлэн (Cash)
- Карт (Card)
- Шилжүүлэг (BankTransfer)
- Зээл (Credit)
- QR (QR)
- Гар утас (Mobile)

### Захиалгын төлөв
- Хүлээгдэж буй (Pending)
- Биелсэн (Fulfilled)
- Цуцлагдсан (Cancelled)
- Хүргэгдсэн (Delivered)

## Дэлгэрэнгүй баримт

📚 [MONGOLIAN_TRANSLATION_GUIDE.md](MONGOLIAN_TRANSLATION_GUIDE.md) - Бүрэн гарын авлага

---

**Амжилт хүсье! 🇲🇳**

