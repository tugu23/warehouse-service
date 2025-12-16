# Production Connection Guide (E-Barimt POS API 3.0)

To connect your warehouse system to the real E-Barimt environment, follow these steps:

## 1. Prerequisites

Ensure you have obtained the following from the Tax Authority (ebarimt.mn):
- **POS Number** (e.g., `123456`)
- **Merchant TIN** (Company Register Number)
- **API Key**
- **API Secret**

## 2. Update Configuration

Open your `.env` file (in the project root) and update the E-Barimt section:

```bash
# E-Barimt Configuration (Production)
EBARIMT_MOCK_MODE=false
EBARIMT_API_URL=https://api.ebarimt.mn/api
EBARIMT_POS_NO=YOUR_POS_NUMBER_HERE
EBARIMT_MERCHANT_TIN=YOUR_MERCHANT_TIN_HERE
EBARIMT_API_KEY=YOUR_API_KEY_HERE
EBARIMT_API_SECRET=YOUR_API_SECRET_HERE
EBARIMT_DISTRICT_CODE=01
```

> **Note:** Replace `YOUR_...` with your actual credentials.

## 3. Verify Connection

After updating the `.env` file, run the verification script:

```bash
npx ts-node scripts/verify-ebarimt-connection.ts
```

If successful, you will see:
`✅ SUCCESS: Connected to E-Barimt system successfully!`

## 4. Troubleshooting

If connection fails:
1. **Check Credentials:** Ensure no extra spaces in keys/secrets.
2. **IP Whitelisting:** Ensure your server's IP address is registered with the Tax Authority if required.
3. **Check Logs:** View detailed logs in `logs/combined.log`.

## 5. API Reference

This implementation follows the [POS API 3.0 Integration Guide](https://developer.itc.gov.mn/docs/ebarimt-api/inbishdm2zj3x-pos-api-3-0-sistemijn-api-holbolt-zaavruud).
- **Endpoint:** `PUT /bill`
- **Authentication:** HMAC-SHA256

