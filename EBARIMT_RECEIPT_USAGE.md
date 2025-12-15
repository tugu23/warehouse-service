# E-Barimt Receipt Usage Guide

## Overview

The system now generates A5-sized e-barimt compliant receipts with all required information according to Mongolian tax law.

## Quick Start

### 1. Generate Receipt for an Order

```bash
# View in browser
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/orders/123/receipt/pdf"

# Download as file
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/orders/123/receipt/pdf?download=true" \
  -o receipt.pdf
```

### 2. Frontend Integration

#### React/TypeScript Example

```typescript
import axios from 'axios';

// View receipt in new window
const viewReceipt = async (orderId: number) => {
  const token = localStorage.getItem('authToken');
  const url = `${API_BASE_URL}/api/orders/${orderId}/receipt/pdf`;
  
  window.open(url, '_blank');
};

// Download receipt
const downloadReceipt = async (orderId: number) => {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/orders/${orderId}/receipt/pdf?download=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      }
    );
    
    // Create download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading receipt:', error);
    alert('Failed to download receipt');
  }
};
```

#### Vue.js Example

```javascript
export default {
  methods: {
    async downloadReceipt(orderId) {
      const token = localStorage.getItem('authToken');
      
      try {
        const response = await this.$axios.get(
          `/api/orders/${orderId}/receipt/pdf?download=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob',
          }
        );
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${orderId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        this.$message.error('Баримт татахад алдаа гарлаа');
      }
    },
  },
};
```

## Receipt Content

### What's Included

The A5-sized receipt includes 7 main sections:

1. **Баримтын ерөнхий мэдээлэл** (General Information)
   - Receipt number
   - E-Barimt DDTD
   - Company TIN
   - Registration date
   - Issue date
   - Payment method

2. **Борлуулагчийн мэдээлэл** (Seller Information)
   - Sales agent name
   - Sales agent phone

3. **Худалдан авагчийн мэдээлэл** (Buyer Information)
   - Customer name
   - Customer phone

4. **Дэлгүүр / Байгууллагын мэдээлэл** (Store Information)
   - Company name
   - Company address
   - Company phones

5. **Худалдан авсан барааны жагсаалт** (Product List)
   - Product table with all items

6. **НӨАТ мэдээлэл** (VAT Information)
   - Total with VAT
   - VAT amount
   - City tax

7. **QR код ба Сугалааны дугаар** (QR Code & Lottery)
   - Scannable QR code
   - 6-digit lottery number (if registered)

## E-Barimt Integration

### For Store Orders

When a Store order is created:

1. Order is automatically registered with e-Barimt system
2. System receives:
   - Bill ID (ДДТД)
   - Lottery number
   - QR code data
3. These fields are saved to the order
4. Receipt generation uses this data

### For Non-Registered Orders

If e-Barimt registration fails or order is not registered:

- Receipt still generates with all available data
- Shows "E-Barimt бүртгэлгүй" message
- Uses order QR code instead of e-Barimt QR
- Can be manually registered later via admin panel

## UI Components

### Add Print Button to Order Details

```typescript
// OrderDetails.tsx
import { Download, Eye, Printer } from 'lucide-react';

const OrderDetailsPage = ({ orderId }) => {
  const handlePrintReceipt = () => {
    viewReceipt(orderId);
  };

  const handleDownloadReceipt = async () => {
    await downloadReceipt(orderId);
  };

  return (
    <div>
      {/* Order details */}
      
      <div className="receipt-actions">
        <button onClick={handlePrintReceipt} className="btn btn-secondary">
          <Eye size={16} />
          Баримт харах
        </button>
        
        <button onClick={handleDownloadReceipt} className="btn btn-primary">
          <Download size={16} />
          Баримт татах
        </button>
        
        <button onClick={() => window.print()} className="btn btn-secondary">
          <Printer size={16} />
          Хэвлэх
        </button>
      </div>
    </div>
  );
};
```

### Add to Order List Actions

```typescript
// OrdersList.tsx
const OrdersList = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Order #</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.orderNumber}</td>
            <td>{order.customer.name}</td>
            <td>₮{order.totalAmount}</td>
            <td>{order.status}</td>
            <td>
              <button 
                onClick={() => viewReceipt(order.id)}
                className="btn-icon"
                title="View receipt"
              >
                <Eye size={16} />
              </button>
              <button 
                onClick={() => downloadReceipt(order.id)}
                className="btn-icon"
                title="Download receipt"
              >
                <Download size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Styling Recommendations

### CSS for Receipt Actions

```css
.receipt-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.receipt-actions button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.receipt-actions .btn-primary {
  background: #2563eb;
  color: white;
}

.receipt-actions .btn-primary:hover {
  background: #1d4ed8;
}

.receipt-actions .btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.receipt-actions .btn-secondary:hover {
  background: #f9fafb;
}

.btn-icon {
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
}

.btn-icon:hover {
  color: #2563eb;
}
```

## Testing

### Test Receipt Generation

1. Create a test order:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "orderType": "Store",
    "paymentMethod": "Cash",
    "items": [
      {
        "productId": 1,
        "quantity": 5
      }
    ]
  }'
```

2. Generate receipt:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/orders/1/receipt/pdf" \
  -o test-receipt.pdf
```

3. Verify receipt:
   - Open `test-receipt.pdf`
   - Check A5 size (148mm x 210mm)
   - Verify all 7 sections are present
   - Test QR code scanning
   - Check lottery number (if e-Barimt registered)

## Common Issues & Solutions

### Issue 1: PDF Not Opening

**Problem**: PDF file won't open or is corrupted.

**Solution**: Check server logs for errors. Ensure all required fields are present in order data.

### Issue 2: Missing E-Barimt Data

**Problem**: Lottery number not showing on receipt.

**Solution**: 
- Check if order is registered with e-Barimt: `GET /api/orders/:id`
- If not registered, manually register: `POST /api/ebarimt/register/:orderId`
- Re-generate receipt

### Issue 3: QR Code Not Scanning

**Problem**: QR code won't scan.

**Solution**: 
- Ensure order has valid e-Barimt QR data
- Check QR code size (should be at least 35mm)
- Verify QR code quality setting in PDF service

### Issue 4: Mongolian Text Not Displaying

**Problem**: Cyrillic characters showing as boxes or question marks.

**Solution**: 
- jsPDF uses Helvetica font which supports Cyrillic
- If still issues, may need to embed custom font
- Check browser PDF viewer settings

## Mobile Considerations

### WhatsApp/Email Sharing

Add sharing functionality for mobile users:

```typescript
const shareReceipt = async (orderId: number) => {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/orders/${orderId}/receipt/pdf?download=true`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      }
    );
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const file = new File([blob], `receipt-${orderId}.pdf`, { 
      type: 'application/pdf' 
    });
    
    if (navigator.share) {
      await navigator.share({
        title: 'Төлбөрийн баримт',
        text: `Захиалгын дугаар: ${orderId}`,
        files: [file],
      });
    } else {
      // Fallback to download
      downloadReceipt(orderId);
    }
  } catch (error) {
    console.error('Error sharing receipt:', error);
  }
};
```

## Performance Tips

1. **Cache receipts**: Store generated PDFs temporarily to avoid regeneration
2. **Lazy load**: Load receipt only when user clicks view/download
3. **Optimize images**: QR code generation is fast but can be cached
4. **Background generation**: For bulk receipts, generate in background job

## Security

- ✅ Receipts require authentication
- ✅ Sales agents can only access their own order receipts
- ✅ Admins/managers can access all receipts
- ✅ No sensitive data exposed in QR code
- ✅ E-Barimt data is read-only after registration

## Next Steps

1. Add receipt email functionality
2. Implement bulk receipt download (multiple orders)
3. Add receipt templates for different order types
4. Integrate with printer API for direct printing
5. Add receipt history/audit log

---

**Implementation Complete**: December 13, 2025  
**Format**: A5 (148mm x 210mm)  
**Compliance**: ✅ Mongolian Tax Law  
**Status**: Production Ready

