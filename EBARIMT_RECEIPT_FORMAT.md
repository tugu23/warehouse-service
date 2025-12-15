# E-Barimt Receipt Printing Format

## Overview

The e-barimt receipt is printed in **A5 format (148mm x 210mm)** and follows the official Mongolian tax authority requirements for electronic fiscal receipts.

## Receipt Structure

### 1. Баримтын ерөнхий мэдээлэл (General Information)

Required fields:
- **Зарлагын падаан №** (Receipt Number): Order number from system
- **ДДТД** (E-Barimt Bill ID): Full e-Barimt registration number
- **ТТД** (TIN): Company Tax Identification Number (5317878)
- **Баримт бүртгэгдсэн огноо** (Registration Date): Date registered with tax authority
- **Бараа олгосон огноо** (Goods Issue Date): Order date
- **Төлбөрийн хэлбэр** (Payment Method): Cash/Card/Transfer/Credit/QR/Mobile

### 2. Борлуулагчийн мэдээлэл (Seller Information)

Required fields:
- **Нэр** (Name): Sales agent name
- **Утас** (Phone): Sales agent phone number

### 3. Худалдан авагчийн мэдээлэл (Buyer Information)

Required fields:
- **Нэр** (Name): Customer name
- **Утас** (Phone): Customer phone number

### 4. Дэлгүүр / Байгууллагын мэдээлэл (Store/Organization Information)

Required fields:
- **Нэр** (Name): GLF LLC OASIS Бөөний төв
- **Хаяг** (Address): Монгол, Улаанбаатар, Сүхбаатар дүүрэг, 6-р хороо, 27-49
- **Утас** (Phone): 70121128, 88048350, 89741277

### 5. Худалдан авсан барааны жагсаалт (Product List)

Table with columns:
- **№** (Number): Sequential number
- **Барааны нэр** (Product Name): Product name
- **Баркод** (Barcode): Product barcode/code
- **Тоо ширхэг** (Quantity): Quantity sold
- **Нэгж үнэ** (Unit Price): Price per unit
- **Нийт үнэ** (Total Price): Total price for line item

### 6. НӨАТ мэдээлэл (VAT Information)

Required fields:
- **НӨАТ-тэй дүн** (Amount with VAT): Total amount including VAT
- **НӨАТ** (VAT): VAT amount (10%)
- **НХАТ** (City Tax): City tax (usually 0)

### 7. QR код ба Сугалааны дугаар (QR Code & Lottery Number)

Required elements:
- **QR Code**: E-Barimt verification QR code (35mm x 35mm)
- **Сугалааны дугаар** (Lottery Number): 6-digit lottery number from e-Barimt system
- **Lottery note**: "Та энэ дугаараа хадгалж, сарын эцэст сугалаанд оролцоно уу!"

## Layout Specifications

### Page Setup
- **Format**: A5 Portrait (148mm x 210mm)
- **Margins**: 10mm on all sides
- **Font**: Helvetica (supports Cyrillic characters)

### Typography
- **Main Headers**: 9pt Bold
- **Section Content**: 8pt Regular
- **Table Headers**: 7pt Bold
- **Table Content**: 7pt Regular
- **Lottery Number**: 16pt Bold
- **Footer**: 7pt Italic

### Spacing
- **Section Spacing**: 4-5mm between sections
- **Line Spacing**: 4mm between fields
- **Divider Lines**: 0.2mm thickness

### QR Code
- **Size**: 35mm x 35mm
- **Position**: Bottom section, left aligned
- **Quality**: High error correction level

### Lottery Number
- **Font Size**: 16pt
- **Style**: Bold
- **Position**: Next to QR code, right aligned

## E-Barimt Integration

### Data Flow
1. Order is created in the system
2. Order is registered with e-Barimt API
3. E-Barimt returns:
   - Bill ID (ДДТД)
   - Lottery number (6 digits)
   - QR code data
   - Registration timestamp
4. Receipt is generated with e-Barimt data
5. PDF is returned to client for printing

### Fallback Behavior
If e-Barimt registration fails:
- Receipt still generates with order information
- "E-Barimt бүртгэлгүй" message shown instead of lottery
- Order QR code used instead of e-Barimt QR
- Receipt can be manually re-registered later

## Payment Method Translation

The system automatically translates payment methods:
- `Cash` → Бэлэн
- `Card` → Карт
- `BankTransfer` → Шилжүүлэг
- `Credit` → Зээл
- `QR` → QR
- `Mobile` → Гар утас

## Currency Formatting

- **Display Format**: Mongolian Tugrik (₮)
- **Separator**: Comma for thousands
- **Decimals**: No decimals in product table (e.g., "12,000")
- **VAT Section**: Two decimals for accuracy (e.g., "6,386.36")

## Example Receipt Data

```typescript
{
  orderId: 123,
  orderNumber: "ORD-2025-0001",
  orderDate: "2025-12-13",
  orderType: "Store",
  status: "Completed",
  
  customer: {
    name: "gloria",
    phoneNumber: "70120067"
  },
  
  agent: {
    name: "Мөнгөншагай",
    phoneNumber: "89741277"
  },
  
  items: [
    {
      productName: "Гүнждийн тос 500ml",
      productCode: "8801039917978",
      quantity: 1,
      unitPrice: 12000,
      total: 12000
    }
  ],
  
  subtotal: 63863.64,
  vat: 6386.36,
  total: 70250,
  
  paymentMethod: "Cash",
  
  // E-Barimt fields
  ebarimtId: "MOCK_1234567890",
  ebarimtBillId: "POS123_ORD-2025-0001",
  ebarimtLottery: "456789",
  ebarimtQrData: "...",
  ebarimtRegistered: true,
  ebarimtDate: "2025-12-13T10:30:00Z"
}
```

## API Usage

### Generate Receipt PDF

```typescript
// In controller
import pdfService from '../services/pdf.service';

const receiptData = {
  orderId: order.id,
  orderNumber: order.orderNumber,
  orderDate: order.orderDate,
  // ... other fields
  ebarimtLottery: order.ebarimtLottery,
  ebarimtQrData: order.ebarimtQrData,
};

const pdfBuffer = await pdfService.generateOrderReceiptPDF(receiptData);

// Return as downloadable file
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', `attachment; filename="receipt-${order.orderNumber}.pdf"`);
res.send(pdfBuffer);
```

## Testing

### Test Receipt Generation

1. Create a test order with e-Barimt enabled
2. Verify all 7 sections are present
3. Check QR code is scannable
4. Verify lottery number is displayed
5. Confirm all Mongolian text renders correctly
6. Validate A5 page size

### Mock Mode Testing

When `EBARIMT_MOCK_MODE=true`:
- System generates mock lottery numbers
- Mock QR codes are created
- Receipt format remains identical to production

## Compliance

This receipt format complies with:
- **Mongolian Tax Law**: Article 13, Electronic Fiscal Device requirements
- **E-Barimt API 3.0**: Official tax authority specification
- **POS Standards**: Ministry of Finance POS device regulations

## Related Files

- `src/services/pdf.service.ts` - PDF generation implementation
- `src/services/ebarimt.service.ts` - E-Barimt API integration
- `src/controllers/orders.controller.ts` - Order creation with e-Barimt
- `EBARIMT_IMPLEMENTATION.md` - Complete e-Barimt guide

---

**Last Updated**: December 13, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready

