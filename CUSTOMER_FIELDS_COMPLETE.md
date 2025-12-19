# Харилцагчийн Талбарууд Нэмэгдсэн Тайлан

## Хийгдсэн Өөрчлөлтүүд

### 1. Prisma Schema өөрчлөлт

Харилцагчийн model-д дараах шинэ талбарууд нэмэгдлээ:
- `realName` - Жинхэнэ нэр (hariltsagch.json-ын "realname")
- `name2` - Хоёр дахь нэр (hariltsagch.json-ын "ner2")
- `legacyCustomerId` - Хуучин системийн ID (hariltsagch.json-ын "hariltsagch_id")
- `direction` - Чиглэл/Зүг (hariltsagch.json-ын "zvg")

Өмнө нь байсан талбарууд:
- `name` - Үндсэн нэр
- `organizationName` - Байгууллагын нэр
- `organizationType` - Байгууллагын төрөл
- `contactPersonName` - Холбоо барих хүний нэр
- `registrationNumber` - Регистрийн дугаар (байгууллагын регистр)
- `address` - Хаяг
- `district` - Дүүрэг
- `detailedAddress` - Дэлгэрэнгүй хаяг
- `phoneNumber` - Утасны дугаар
- `isVatPayer` - НӨАТ төлөгч эсэх
- `paymentTerms` - Төлбөрийн нөхцөл
- `locationLatitude` - Өргөрөг
- `locationLongitude` - Уртраг
- `customerTypeId` - Харилцагчийн төрөл
- `assignedAgentId` - Хариуцсан борлуулагч

### 2. Migration

Migration файл үүсгэж, өгөгдлийн санд амжилттай ажилуулсан:
- `prisma/migrations/20251219231344_add_customer_fields/migration.sql`

### 3. Controller Өөрчлөлт

`customers.controller.ts` файлд:
- `createCustomer` - Шинэ талбаруудыг бүртгэх
- `updateCustomer` - Шинэ талбаруудыг шинэчлэх
- `getAllCustomers` - Search хийхэд `realName` болон `name2` талбарууд нэмэгдсэн

### 4. Routes Validation

`customers.routes.ts` файлд:
- POST `/api/customers` - Шинэ харилцагч үүсгэх validation
- PUT `/api/customers/:id` - Харилцагч шинэчлэх validation

## API Endpoints

### Харилцагч үүсгэх
```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Харилцагчийн нэр",
  "realName": "Жинхэнэ нэр",
  "name2": "Хоёр дахь нэр",
  "legacyCustomerId": 5749751,
  "organizationName": "Байгууллагын нэр",
  "registrationNumber": "1234567",
  "address": "Хаяг",
  "district": "Дүүрэг",
  "phoneNumber": "88888888",
  "isVatPayer": true,
  "paymentTerms": "Бэлэн",
  "direction": "Зүг оруулаагүй байна",
  "customerTypeId": 1,
  "assignedAgentId": 7
}
```

### Харилцагч шинэчлэх
```http
PUT /api/customers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "registrationNumber": "1234567890"
}
```

### Бүх харилцагч авах (регистртэй)
```http
GET /api/customers
Authorization: Bearer <token>
```

Response-д одоо бүх талбарууд буцна:
```json
{
  "status": "success",
  "data": {
    "customers": [
      {
        "id": 1,
        "name": "Харилцагчийн нэр",
        "realName": "Жинхэнэ нэр",
        "name2": "Хоёр дахь нэр",
        "legacyCustomerId": 5749751,
        "organizationName": "Байгууллагын нэр",
        "registrationNumber": "1234567",
        "address": "Хаяг",
        "district": "Дүүрэг",
        "detailedAddress": null,
        "phoneNumber": "88888888",
        "isVatPayer": true,
        "paymentTerms": "Бэлэн",
        "locationLatitude": null,
        "locationLongitude": null,
        "direction": "Зүг оруулаагүй байна",
        "customerTypeId": 1,
        "assignedAgentId": 7,
        "customerType": { ... },
        "assignedAgent": { ... }
      }
    ],
    "pagination": { ... }
  }
}
```

## Өгөгдлийн Mapping (hariltsagch.json -> Database)

| hariltsagch.json | Database Column | Тайлбар |
|------------------|-----------------|---------|
| id | id | Автомат ID |
| ner | name | Үндсэн нэр |
| realname | realName | Жинхэнэ нэр |
| ner2 | name2 | Хоёр дахь нэр |
| hariltsagch_id | legacyCustomerId | Хуучин системийн ID |
| tulbur_helber | paymentTerms | Төлбөрийн хэлбэр |
| borluulagch_id | assignedAgentId | Борлуулагчийн ID |
| dvvreg | registrationNumber | Байгууллагын регистр |
| hayg | address | Хаяг |
| utas | phoneNumber | Утас |
| noat_tulugch | isVatPayer | НӨАТ төлөгч |
| kordinat_x | locationLatitude | Координат X |
| kordinat_y | locationLongitude | Координат Y |
| turul | customerTypeId | Төрөл |
| zvg | direction | Чиглэл/Зүг |

## Статус

✅ Prisma schema-д бүх column нэмэгдсэн
✅ Migration үүсгэж ажилуулсан
✅ Prisma client generate хийсэн
✅ Controller-үүд шинэчлэгдсэн
✅ Routes validation нэмэгдсэн
✅ API endpoints бэлэн

**Харилцагчийн хуудас дээр одоо бүх талбарууд, тэр дундаа байгууллагын регистр харагдаж байгаа!**

