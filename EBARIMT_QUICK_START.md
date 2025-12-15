# E-Barimt Quick Reference

## 🎯 What Was Done

Analyzed [e-Barimt POS API 3.0](https://developer.itc.gov.mn/docs/ebarimt-api/8mw1byololjkv-cz-ahim-t-lb-rijn-barimtyn-sistem-pos-api-3-0) and implemented **complete integration** with Mongolia's electronic fiscal receipt system.

## ✅ Status: LIVE & RUNNING

```bash
✓ Database migrated with e-Barimt fields
✓ E-Barimt service created
✓ Auto-registration on Store orders
✓ 5 API endpoints added
✓ Mock mode active for testing
✓ Server running successfully
```

---

## 🚀 Quick Test

### 1. Check System Status

```bash
curl http://localhost:3000/api/ebarimt/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Create Store Order (Auto-Registers)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "orderType": "Store",
    "paymentMethod": "Cash",
    "items": [{"productId": 1, "quantity": 5}]
  }'
```

Response includes:
```json
{
  "order": {
    "ebarimtLottery": "456789",  ← Lottery number for customer
    "ebarimtBillId": "POS_...",  ← Bill ID
    "ebarimtQrData": "...",      ← QR code data
    "ebarimtRegistered": true
  }
}
```

### 3. View Unregistered Orders

```bash
curl http://localhost:3000/api/ebarimt/orders/unregistered \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 New API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ebarimt/status` | GET | System status |
| `/api/ebarimt/register/:orderId` | POST | Manual retry |
| `/api/ebarimt/bill/:billId` | GET | Get bill details |
| `/api/ebarimt/return/:orderId` | POST | Cancel bill |
| `/api/ebarimt/orders/unregistered` | GET | List failures |

---

## 🔧 Environment Variables

Add to `.env`:

```bash
EBARIMT_MOCK_MODE=true                    # Start with mock mode
EBARIMT_API_URL=https://api.ebarimt.mn/api
EBARIMT_POS_NO=your_pos_number           # Get from Tax Authority
EBARIMT_MERCHANT_TIN=your_tax_id         # Your company TIN
EBARIMT_API_KEY=your_api_key             # From registration
EBARIMT_API_SECRET=your_api_secret       # From registration
EBARIMT_DISTRICT_CODE=01                 # 01=Ulaanbaatar
```

---

## 📊 Database Fields Added

```sql
-- Orders table now has:
ebarimt_id          VARCHAR(100)
ebarimt_bill_id     VARCHAR(100)
ebarimt_lottery     VARCHAR(50)      -- Display to customer!
ebarimt_qr_data     TEXT             -- For QR code
ebarimt_registered  BOOLEAN
ebarimt_date        TIMESTAMP
ebarimt_return_id   VARCHAR(100)
order_number        VARCHAR(50) UNIQUE
```

---

## 🎨 Frontend Display

### Lottery Number (Prominent)

```tsx
<div className="lottery-badge">
  <span>Сугалааны дугаар</span>
  <h1>{order.ebarimtLottery}</h1>
  <p>Энэ дугаараа хадгалаарай!</p>
</div>
```

### QR Code

```tsx
import QRCode from 'qrcode.react';

<QRCode value={order.ebarimtQrData} size={200} />
```

### Bill ID

```
E-Barimt ID: {order.ebarimtBillId}
```

---

## 🔄 How It Works

### Automatic (Default)

1. User creates **Store** order
2. System saves order to database
3. System calls e-Barimt API
4. Lottery number saved
5. Order returned with receipt info

### Manual (If Failed)

1. Check unregistered orders
2. Click "Register" button
3. System retries e-Barimt call
4. Success: lottery saved

---

## 📝 Files Created

```
src/services/ebarimt.service.ts      ← Main service
src/routes/ebarimt.routes.ts         ← API endpoints
prisma/migrations/.../migration.sql  ← Database changes
EBARIMT_IMPLEMENTATION.md            ← Full documentation
```

## 📝 Files Modified

```
prisma/schema.prisma                 ← Added fields
src/config/index.ts                  ← Config
src/controllers/orders.controller.ts ← Auto-register
src/app.ts                           ← Routes
.env.example                         ← Variables
```

---

## 🎯 Next Steps

### For Testing (Now)

1. ✅ Already in mock mode
2. ✅ Create test orders
3. ✅ See mock lottery numbers
4. ✅ Test all endpoints

### For Production (Later)

1. [ ] Register with Tax Authority
2. [ ] Get real credentials
3. [ ] Update `.env` with real values
4. [ ] Set `EBARIMT_MOCK_MODE=false`
5. [ ] Restart server
6. [ ] Test with real order
7. [ ] Verify on ebarimt.mn

---

## 🆘 Troubleshooting

### "Order not registered"

- Check `/api/ebarimt/orders/unregistered`
- Use `/api/ebarimt/register/:orderId` to retry

### "E-Barimt offline"

- Check `/api/ebarimt/status`
- Verify credentials
- Check `EBARIMT_MOCK_MODE` setting

### No lottery number

- Only Store orders (not Market orders)
- Check `ebarimtRegistered` field
- View logs: `logs/combined.log`

---

## 📚 Documentation

- **Full Guide:** `EBARIMT_IMPLEMENTATION.md`
- **API Docs:** http://localhost:3000/api-docs
- **Official:** https://developer.itc.gov.mn/docs/ebarimt-api

---

## ✨ Key Features

✅ **Automatic:** Store orders auto-register  
✅ **Lottery:** 6-digit number for customers  
✅ **QR Code:** Verification support  
✅ **Mock Mode:** Safe testing  
✅ **Retry:** Manual registration available  
✅ **Returns:** Bill cancellation supported  
✅ **VAT:** Proper B2B/B2C handling  
✅ **Secure:** HMAC-SHA256 authentication  

---

**Status:** ✅ READY TO USE (Mock Mode)  
**Server:** ✅ RUNNING  
**Date:** December 5, 2025

