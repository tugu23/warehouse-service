# e-Tax API Integration - Байгууллагын мэдээлэл татах

Монгол Улсын Татварын Цахим Системтэй (e-Tax API) холбогдож, байгууллагын мэдээллийг регистрийн дугаараар татах функц нэмэгдсэн.

## 🎯 Үндсэн функцууд

### Backend API

#### 1. **e-Tax Service** (`src/services/etax.service.ts`)
- Татварын системээс байгууллагын мэдээлэл татах
- Регистрийн дугаар validate хийх
- 7 оронтой регистрийн дугаартай ажиллана

#### 2. **e-Tax Controller** (`src/controllers/etax.controller.ts`)
- REST API endpoint бүхий controller
- Error handling

#### 3. **e-Tax Routes** (`src/routes/etax.routes.ts`)
- Swagger documentation
- Authentication middleware

### API Endpoint

```http
GET /api/etax/organization/:regno
Authorization: Bearer <token>
```

**Example Request:**
```bash
curl -X GET \
  'http://localhost:3000/api/etax/organization/5003059' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "organization": {
      "regno": "5003059",
      "name": "НОМИН ХОЛДИНГ ХХК",
      "address": "Улаанбаатар, Сүхбаатар дүүрэг",
      "vatPayer": true,
      "status": "active"
    }
  }
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "message": "Байгууллагын мэдээлэл олдсонгүй. Регистрийн дугаараа шалгана уу."
}
```

## 🎨 Frontend Integration

### CustomerForm (`src/features/customers/CustomerForm.tsx`)

Шинэ харилцагч нэмэх үед:

1. **Регистрийн дугаар оруулах** (7 орон)
2. **🔍 Хайх товч дарах**
3. **Автоматаар бөглөгдөнө:**
   - ✅ Байгууллагын нэр
   - ✅ НӨАТ төлөгч эсэх
   - ✅ Хаяг (хэрэв байвал)

### UI Features

- 🔍 **Search Icon Button** - Регистрээр хайх
- ⏳ **Loading Spinner** - Хайлт явагдаж байх үед
- ✅ **Success Alert** - Амжилттай олдсон
- ❌ **Error Alert** - Олдоогүй эсвэл алдаа гарсан
- ⚠️ **Warning Alert** - Системийн алдаа

### Example Usage

1. Шинэ харилцагч нэмэх хэсэг рүү орох
2. Регистрийн дугаар талбарт `5003059` гэж оруулах
3. 🔍 хайх товч дарах
4. Системээс автоматаар татагдана:
   ```
   Нэр: НОМИН ХОЛДИНГ ХХК
   НӨАТ төлөгч: ✓ Тийм
   Хаяг: Улаанбаатар, Сүхбаатар дүүрэг
   ```

## 🔗 API Documentation

Татварын API баримтжуулалт:
https://developer.itc.gov.mn/docs/etax-api/nqh4bo7fueesg-bajguullagyn-medeelel-avah

### Endpoint Details

- **Base URL:** `https://api.ebarimt.mn`
- **Endpoint:** `/api/info/check/getTinInfo`
- **Method:** GET
- **Params:** `regno` (7-digit registration number)
- **Response Format:** JSON

## ⚙️ Configuration

### Environment Variables

Хэрэв e-Tax API-д authentication шаардлагатай бол:

```env
# e-Tax API Configuration
ETAX_API_URL=https://api.ebarimt.mn
ETAX_API_KEY=your_api_key_here
ETAX_API_TIMEOUT=10000
```

## 🧪 Testing

### Manual Testing

1. **Valid Registration Number:**
   ```bash
   GET /api/etax/organization/5003059
   ```
   Expected: Success with organization info

2. **Invalid Format:**
   ```bash
   GET /api/etax/organization/123
   ```
   Expected: 400 Bad Request

3. **Not Found:**
   ```bash
   GET /api/etax/organization/9999999
   ```
   Expected: 404 Not Found

### Integration Test Example

```typescript
describe('e-Tax API Integration', () => {
  it('should fetch organization info by valid regno', async () => {
    const response = await request(app)
      .get('/api/etax/organization/5003059')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.organization.regno).toBe('5003059');
  });

  it('should return 404 for non-existent regno', async () => {
    const response = await request(app)
      .get('/api/etax/organization/9999999')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(404);

    expect(response.body.status).toBe('error');
  });
});
```

## 📝 Error Handling

### Backend Errors

- **Invalid Format** - 400 Bad Request
- **Not Found** - 404 Not Found  
- **API Timeout** - 500 Internal Server Error
- **Network Error** - 500 Internal Server Error

### Frontend Errors

- **Empty Input** - Toast: "7 оронтой регистрийн дугаар оруулна уу"
- **404 Response** - Alert: "❌ Татварын системд бүртгэлгүй регистр"
- **Other Errors** - Alert: "⚠️ Системд алдаа гарлаа"

## 🚀 Future Enhancements

- [ ] Cache e-Tax responses (avoid duplicate API calls)
- [ ] Batch lookup for multiple organizations
- [ ] Real-time validation during typing
- [ ] Additional organization details (director name, industry, etc.)
- [ ] History of lookups

## 🔒 Security Considerations

1. **Authentication Required** - All endpoints require valid JWT token
2. **Rate Limiting** - Prevent abuse of external API
3. **Input Validation** - Validate registration number format
4. **Error Messages** - Don't expose sensitive information
5. **Logging** - Log all external API calls for monitoring

## 📊 Monitoring

Monitor e-Tax API integration:

```typescript
logger.info('e-Tax API call', {
  regno: cleanRegno,
  success: true,
  responseTime: 250, // ms
});

logger.error('e-Tax API error', {
  regno: cleanRegno,
  error: error.message,
  status: error.response?.status,
});
```

## ✅ Status

- ✅ Backend service implemented
- ✅ REST API endpoint created
- ✅ Frontend integration complete
- ✅ Error handling added
- ✅ UI/UX enhancements
- ✅ Documentation completed

---

**Анхаарах зүйл:** e-Tax API нь Монгол Улсын албан ёсны татварын систем юм. Production орчинд ашиглахдаа API key болон authentication-ийг зөв тохируулах шаардлагатай байж болно.

