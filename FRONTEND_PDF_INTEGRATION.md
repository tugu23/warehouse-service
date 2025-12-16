# PDF Receipt Integration Guide for Frontend

## Overview
New feature added: Generate and view/download order receipts as PDF files with complete order details, QR code, and company information.

## API Endpoint

```
GET /api/orders/:id/receipt/pdf
```

### Authentication
Requires Bearer token in Authorization header (same as other endpoints).

### Parameters

**Path Parameter:**
- `id` (required): Order ID (integer)

**Query Parameter:**
- `download` (optional): Boolean, default `false`
  - `false`: Display PDF in browser (inline)
  - `true`: Download PDF file

### Response
- **Content-Type:** `application/pdf`
- **Response Body:** PDF file (binary data)

## Implementation Examples

### 1. View PDF in Browser (New Tab/Window)

```javascript
const viewOrderReceipt = (orderId) => {
  const token = localStorage.getItem('authToken'); // or however you store it
  const url = `${API_BASE_URL}/api/orders/${orderId}/receipt/pdf`;
  
  // Open in new tab
  window.open(url, '_blank');
  
  // Note: Browser will handle authentication if you include credentials
};
```

### 2. Download PDF File

```javascript
const downloadOrderReceipt = async (orderId) => {
  const token = localStorage.getItem('authToken');
  const url = `${API_BASE_URL}/api/orders/${orderId}/receipt/pdf?download=true`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to download PDF');
    
    // Create blob from response
    const blob = await response.blob();
    
    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `receipt-order-${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    // Handle error (show toast/notification)
  }
};
```

### 3. Embed in iframe (View in Modal)

```javascript
const viewReceiptInModal = (orderId) => {
  const token = localStorage.getItem('authToken');
  const url = `${API_BASE_URL}/api/orders/${orderId}/receipt/pdf`;
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.width = '100%';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  
  // Add to modal or container
  document.getElementById('pdf-container').appendChild(iframe);
};
```

### 4. React Example with Axios

```jsx
import axios from 'axios';

const OrderReceipt = ({ orderId }) => {
  const viewPDF = () => {
    const url = `/api/orders/${orderId}/receipt/pdf`;
    window.open(url, '_blank');
  };
  
  const downloadPDF = async () => {
    try {
      const response = await axios.get(
        `/api/orders/${orderId}/receipt/pdf?download=true`,
        {
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  
  return (
    <div>
      <button onClick={viewPDF}>View Receipt</button>
      <button onClick={downloadPDF}>Download Receipt</button>
    </div>
  );
};
```

## UI Recommendations

### Where to Add Buttons

1. **Order List Page:**
   - Add "View Receipt" icon/button next to each order

2. **Order Detail Page:**
   - Add "View Receipt (PDF)" button
   - Add "Download Receipt" button

3. **Order Actions Menu:**
   - Include in dropdown menu with other order actions

### Suggested Icons
- 📄 View Receipt
- ⬇️ Download Receipt
- 🖨️ Print (use view with browser print)

## PDF Content Includes

- Company header and contact info
- Order number and date
- Customer information (name, address, phone)
- Sales agent name
- Items table (product name, code, quantity, price, total)
- Subtotal, VAT (for Store orders), and Total
- Payment information (method, status, amounts)
- Credit terms and due date (if applicable)
- QR code for verification
- Order status

## Error Handling

Common errors to handle:
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: User doesn't have access to this order (sales agents can only see their own)
- `404 Not Found`: Order doesn't exist

## Testing

Test with these scenarios:
1. Store order (with VAT)
2. Market order (without VAT)
3. Cash payment order
4. Credit payment order (shows due date)
5. Order with multiple items
6. Different user roles (Admin, Manager, SalesAgent)

## Notes

- PDFs are generated on-demand (not cached)
- Generation takes ~100-150ms
- PDF size is typically 120-130KB
- Supports both Mongolian and English text
- QR code contains order verification data
- Sales agents can only view receipts for their own orders









