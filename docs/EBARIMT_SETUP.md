# E-Barimt Integration Setup

Энэ баримт бичиг нь Монголын Цахим Төлбөрийн Баримт (E-Barimt) POS API 3.0-тай холбогдох тохиргоог тайлбарласан.

## Шаардлагатай зүйлс

1. E-Barimt системд бүртгэлтэй байх
2. POS дугаар (POS_NO) авах
3. Байгууллагын регистрийн дугаар (REG_NO)
4. API Key (зайлшгүй биш, гэхдээ санал болгож байна)

## Environment Variables Тохиргоо

`.env` файлдаа дараах тохиргоог нэмнэ үү:

```bash
# E-Barimt Configuration
EBARIMT_ENABLED=true
EBARIMT_API_URL=https://api.ebarimt.mn/api/put/put
EBARIMT_POS_NO=YOUR_POS_NUMBER
EBARIMT_REG_NO=YOUR_REGISTRATION_NUMBER
EBARIMT_API_KEY=YOUR_API_KEY  # Optional
```

### Тайлбар:

- **EBARIMT_ENABLED**: E-Barimt сервисийг идэвхжүүлэх/идэвхгүй болгох (`true`/`false`)
- **EBARIMT_API_URL**: E-Barimt API endpoint (production: `https://api.ebarimt.mn/api/put/put`)
- **EBARIMT_POS_NO**: Танай POS төхөөрөмжийн дугаар
- **EBARIMT_REG_NO**: Байгууллагын регистрийн дугаар
- **EBARIMT_API_KEY**: API хандах түлхүүр (хэрэв шаардлагатай бол)

## Test Environment

Туршилтын орчинд:

```bash
EBARIMT_ENABLED=true
EBARIMT_API_URL=https://test-api.ebarimt.mn/api/put/put
EBARIMT_POS_NO=TEST_POS_123
EBARIMT_REG_NO=1234567
```

## Хэрхэн ажилладаг вэ?

### 1. Захиалга үүсгэх үед

Store төрлийн захиалга үүсгэх үед автоматаар E-Barimt-тай холбогдож:
- Баримт бүртгүүлнэ
- ДДТД (Баримтын ID) авна
- Сугалааны дугаар авна
- QR код мэдээлэл авна

```typescript
POST /api/orders
{
  "orderType": "Store",  // Store order only
  "customerId": 1,
  "items": [...],
  ...
}
```

### 2. PDF Баримт үүсгэх үед

PDF баримт үүсгэх үед автоматаар дараах мэдээлэл харагдана:
- ДДТД (Баримтын ID)
- Сугалааны дугаар
- QR код
- Баримт бүртгэгдсэн огноо

```typescript
GET /api/orders/:id/pdf
```

## API Холболтын жишээ

### Баримт бүртгэх

```typescript
// E-Barimt-тай холбогдох
const result = await ebarimtService.registerReceipt({
  orderNumber: "ORD-000001",
  customer: {
    name: "Customer Name",
    registrationNumber: "1234567"  // Optional - байгууллага бол
  },
  items: [{
    productName: "Product 1",
    barcode: "1234567890123",
    quantity: 2,
    unitPrice: 10000,
    total: 20000
  }],
  subtotal: 20000,
  vat: 2000,  // 10% VAT
  total: 22000,
  paymentMethod: "Cash"
});

if (result.success) {
  console.log("ДДТД:", result.data.billId);
  console.log("Сугалаа:", result.data.lottery);
  console.log("QR:", result.data.qrData);
}
```

### Баримт буцаах (Return)

```typescript
const result = await ebarimtService.returnReceipt(billId);
```

## Алдаа засах (Troubleshooting)

### E-Barimt бүртгэгдэхгүй байвал:

1. Environment variables зөв тохируулсан эсэхийг шалгана:
   ```bash
   echo $EBARIMT_ENABLED
   echo $EBARIMT_POS_NO
   echo $EBARIMT_REG_NO
   ```

2. Server логийг шалгана:
   ```bash
   # E-Barimt registration хэсгийг хайна
   grep "E-Barimt" logs/*.log
   ```

3. Service идэвхтэй эсэхийг шалгана:
   ```typescript
   console.log(ebarimtService.isServiceEnabled());  // Should be true
   ```

### Түгээмэл алдаанууд:

- **SERVICE_DISABLED**: `EBARIMT_ENABLED=true` тохируулаагүй
- **API_ERROR**: API холболтын алдаа - POS_NO, REG_NO зөв эсэхийг шалгана
- **TIMEOUT**: API хариу удаан - network шалгана

## Хөгжүүлэгчийн мэдээлэл

### API Documentation:
- [POS API 3.0 холболт](https://developer.itc.gov.mn/docs/ebarimt-api/inbishdm2zj3x-pos-api-3-0-sistemijn-api-holbolt-zaavruud)
- [Баримт бүртгэх](https://developer.itc.gov.mn/docs/ebarimt-api/etzeubckb91df-t-lb-rijn-barimt-hadgalah)
- [Баримт буцаах](https://developer.itc.gov.mn/docs/ebarimt-api/w7pedek4l5nu8-t-lb-rijn-barimt-buczaah)

### Файлууд:
- `src/services/ebarimt.service.ts` - E-Barimt service
- `src/controllers/orders.controller.ts` - Integration хэсэг
- `src/services/pdf-pdfkit.service.ts` - PDF дээр E-Barimt мэдээлэл харуулах

## Production Deployment

Production орчинд deploy хийхдээ:

1. Бодит E-Barimt credentials ашиглана
2. HTTPS хэрэглэнэ
3. API timeout-ыг бодолцоно (30 секунд default)
4. Error handling болон retry logic нэмнэ
5. Logs болон monitoring тохируулна

## Дэмжлэг

Асуудал гарвал:
- E-Barimt technical support: +976-XXXX-XXXX
- ITC support: https://developer.itc.gov.mn

