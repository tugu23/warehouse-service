# E-Barimt PDF Integration Testing Guide

## Overview

This document describes how to test the E-Barimt integration with PDF receipt generation implemented in `src/controllers/orders.controller.ts`.

## What Was Implemented

The `getOrderReceiptPDF` endpoint now automatically registers orders with E-Barimt before generating the PDF receipt if they haven't been registered yet.

### Changes Made

1. **Added `classificationCode` to product query** (line 865)
   - Now fetches the BUNA classification code for each product

2. **Added E-Barimt registration logic** (lines 919-982)
   - Checks if order is already registered (`ebarimtRegistered` flag)
   - If not registered, calls `ebarimtService.registerReceipt()`
   - Updates database with E-Barimt response data
   - Updates local order object for PDF generation
   - Throws error and blocks PDF generation if registration fails

3. **Error handling**
   - Returns 500 error with Mongolian error message if E-Barimt registration fails
   - Logs all registration attempts and results

## Test Scenarios

### 1. Test with Unregistered Order

**Endpoint:** `GET /api/orders/:id/receipt/pdf`

**Prerequisites:**
- Order exists in database
- Order has `ebarimtRegistered = false` or `null`
- E-Barimt service is enabled (`EBARIMT_ENABLED=true`)
- E-Barimt API is accessible

**Expected Result:**
1. Order is registered with E-Barimt
2. Database is updated with E-Barimt data:
   - `ebarimtId`
   - `ebarimtBillId`
   - `ebarimtLottery`
   - `ebarimtQrData`
   - `ebarimtRegistered = true`
   - `ebarimtDate` (timestamp)
3. PDF is generated with E-Barimt information
4. PDF includes QR code and lottery number (for B2C)

**Test Command:**
```bash
# Get your auth token first
TOKEN="your-jwt-token"

# Get PDF for order ID 1
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/orders/1/receipt/pdf" \
  -o test-receipt.pdf

# Check if PDF was created
ls -lh test-receipt.pdf

# Check database to verify registration
# (use your database client)
SELECT id, order_number, ebarimt_registered, ebarimt_bill_id, ebarimt_lottery 
FROM orders 
WHERE id = 1;
```

### 2. Test with Already Registered Order

**Prerequisites:**
- Order exists with `ebarimtRegistered = true`
- Order has existing E-Barimt data

**Expected Result:**
1. E-Barimt registration is **skipped** (no API call)
2. Existing E-Barimt data is used in PDF
3. PDF is generated successfully

**Verification:**
- Check logs - should NOT see "Registering order X with E-Barimt" message
- Request should be faster (no API call delay)

### 3. Test Error Handling (E-Barimt Service Disabled)

**Prerequisites:**
- Set `EBARIMT_ENABLED=false` in environment

**Expected Result:**
1. E-Barimt registration returns `SERVICE_DISABLED` error
2. HTTP 500 error is returned
3. PDF generation is blocked
4. Error message in Mongolian: "E-Barimt баrimт бүртгэл амжилтгүй: ..."

**Test Command:**
```bash
# Should return 500 error
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/orders/1/receipt/pdf" \
  -v
```

### 4. Test Error Handling (E-Barimt API Unavailable)

**Prerequisites:**
- E-Barimt service enabled but API is unreachable
- Or simulate network error

**Expected Result:**
1. E-Barimt registration fails with network error
2. HTTP 500 error is returned
3. PDF generation is blocked
4. Error is logged with details

### 5. Test B2C vs B2B

**B2C Test (Consumer without TIN):**
- Customer has no `registrationNumber`
- PDF should include lottery number
- E-Barimt request has `type: "B2C_RECEIPT"`

**B2B Test (Organization with TIN):**
- Customer has `registrationNumber` (company TIN)
- PDF should NOT include lottery number
- E-Barimt request has `type: "B2B_RECEIPT"`

### 6. Test City Tax (NHAT)

**Ulaanbaatar Customer:**
- Customer district is one of: 01, 02, 03, 04, 05, 06, 07, 08, 09
- Order type is "Store"
- City tax should be calculated (2% of subtotal)
- E-Barimt request includes `totalCityTax`

**Non-Ulaanbaatar Customer:**
- Customer district is NOT in UB list
- City tax should be 0
- E-Barimt request has `totalCityTax: 0`

## Verification Checklist

- [ ] Unregistered order gets registered before PDF generation
- [ ] Database is updated with E-Barimt data
- [ ] Already registered orders skip registration
- [ ] PDF includes E-Barimt information (Bill ID, QR code, lottery)
- [ ] Errors block PDF generation (no partial PDFs)
- [ ] Error messages are in Mongolian
- [ ] Logs show registration attempts and results
- [ ] B2C orders include lottery number
- [ ] B2B orders exclude lottery number
- [ ] City tax is calculated for Ulaanbaatar Store orders
- [ ] Classification codes are sent for products that have them

## Log Messages to Look For

**Successful Registration:**
```
info: Registering order 123 with E-Barimt before generating PDF
info: E-Barimt registration successful for order 123 { billId: '...', lottery: '...' }
info: PDF receipt generated for order 123 (view)
```

**Failed Registration:**
```
info: Registering order 123 with E-Barimt before generating PDF
error: E-Barimt registration failed for order 123 { error: '...', errorCode: '...' }
error: Error generating PDF receipt: { error: 'E-Barimt баrimт бүртгэл амжилтгүй: ...' }
```

**Already Registered (no new registration):**
```
info: PDF receipt generated for order 123 (view)
```
(Notice: no "Registering order" message)

## Database Schema Verification

The Order table should have these fields populated after successful registration:

```sql
SELECT 
  id,
  order_number,
  ebarimt_id,
  ebarimt_bill_id,
  ebarimt_lottery,
  ebarimt_qr_data,
  ebarimt_registered,
  ebarimt_date
FROM orders
WHERE ebarimt_registered = true
LIMIT 1;
```

## API Response Examples

**Success (200):**
- Returns PDF file with proper headers
- Content-Type: `application/pdf; charset=utf-8`
- Content-Disposition: `inline` or `attachment` based on query param

**Error (500):**
```json
{
  "status": "error",
  "message": "E-Barimt баrimт бүртгэл амжилтгүй: SERVICE_DISABLED"
}
```

## Configuration Check

Verify these environment variables are set:

```bash
# Required for E-Barimt to work
EBARIMT_ENABLED=true
EBARIMT_API_URL=http://192.168.1.213:7080
EBARIMT_POS_NO=10012516
EBARIMT_MERCHANT_TIN=37900846788
EBARIMT_DISTRICT_CODE=06
EBARIMT_BRANCH_NO=1
```

## Troubleshooting

### Issue: "E-Barimt service is disabled"
**Solution:** Set `EBARIMT_ENABLED=true` in your `.env` file

### Issue: Network timeout
**Solution:** Check if E-Barimt API URL is accessible from your server

### Issue: "Invalid TIN"
**Solution:** Verify customer registration number format (11-14 digits)

### Issue: Missing classification codes
**Solution:** Products without `classificationCode` will be sent without it. E-Barimt API may accept or reject depending on validation rules.

## Next Steps

After implementing and testing, consider:

1. Adding retry logic for transient network errors
2. Implementing background job for bulk registration
3. Adding admin interface to view E-Barimt registration status
4. Creating reports for registered vs unregistered orders
5. Implementing E-Barimt sync verification (compare DB vs E-Barimt system)
