# E-Barimt Receipt Quick Reference

## 🚀 Quick Start

### Generate Receipt
```bash
# View in browser
GET /api/orders/:id/receipt/pdf

# Download as file
GET /api/orders/:id/receipt/pdf?download=true
```

### Frontend (React/TypeScript)
```typescript
// View receipt
window.open(`/api/orders/${orderId}/receipt/pdf`, '_blank');

// Download receipt
const response = await axios.get(
  `/api/orders/${orderId}/receipt/pdf?download=true`,
  { responseType: 'blob' }
);
const blob = new Blob([response.data], { type: 'application/pdf' });
// ... create download link
```

## 📄 Receipt Structure

### 7 Required Sections

1. **Баримтын ерөнхий мэдээлэл** - General info (receipt #, dates, payment)
2. **Борлуулагчийн мэдээлэл** - Seller info (agent name, phone)
3. **Худалдан авагчийн мэдээлэл** - Buyer info (customer name, phone)
4. **Дэлгүүр / Байгууллагын мэдээлэл** - Store info (company details)
5. **Худалдан авсан барааны жагсаалт** - Product list (table)
6. **НӨАТ мэдээлэл** - VAT info (amounts, taxes)
7. **QR код ба Сугалааны дугаар** - QR code & lottery number

## 📐 Format

- **Size**: A5 (148mm × 210mm)
- **Orientation**: Portrait
- **Language**: Mongolian (Cyrillic)
- **Font**: Helvetica

## 🔑 Key Fields

### E-Barimt Data (when registered)
- `ebarimtBillId` - ДДТД number
- `ebarimtLottery` - 6-digit lottery number
- `ebarimtQrData` - QR code data
- `ebarimtDate` - Registration date

### Company Info
- Name: GLF LLC OASIS Бөөний төв
- TIN: 5317878
- Address: Монгол, Улаанбаатар, Сүхбаатар дүүрэг, 6-р хороо, 27-49
- Phones: 70121128, 88048350, 89741277

## 💡 Payment Method Translation

| English | Mongolian |
|---------|-----------|
| Cash | Бэлэн |
| Card | Карт |
| BankTransfer | Шилжүүлэг |
| Credit | Зээл |
| QR | QR |
| Mobile | Гар утас |

## 🎯 Typography

| Element | Size | Weight |
|---------|------|--------|
| Main title | 14pt | Bold |
| Section headers | 9pt | Bold |
| Field labels | 8pt | Bold |
| Field values | 8pt | Normal |
| Table headers | 7pt | Bold |
| Table data | 7pt | Normal |
| Lottery number | 16pt | Bold |

## 📊 API Response

```typescript
// Content-Type: application/pdf
// Content-Disposition: inline | attachment
// Body: PDF binary data
```

## 🔒 Security

- ✅ Bearer token required
- ✅ Role-based access
- ✅ Sales agents: own orders only
- ✅ Managers/admins: all orders

## 🧪 Testing

```bash
# Build
npm run build

# Test endpoint
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/orders/1/receipt/pdf \
  -o test.pdf

# Open PDF
open test.pdf  # macOS
xdg-open test.pdf  # Linux
```

## 📱 Mobile Sharing

```typescript
const shareReceipt = async (orderId: number) => {
  const file = new File([blob], `receipt-${orderId}.pdf`, { 
    type: 'application/pdf' 
  });
  
  if (navigator.share) {
    await navigator.share({
      title: 'Төлбөрийн баримт',
      files: [file],
    });
  }
};
```

## 🎨 UI Components

### Button Examples

```tsx
// View button
<button onClick={() => viewReceipt(orderId)}>
  <Eye /> Харах
</button>

// Download button
<button onClick={() => downloadReceipt(orderId)}>
  <Download /> Татах
</button>

// Share button (mobile)
<button onClick={() => shareReceipt(orderId)}>
  <Share2 /> Хуваалцах
</button>
```

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| PDF won't open | Check server logs for errors |
| Missing lottery | Manually register with e-Barimt |
| QR not scanning | Ensure high-quality print/display |
| Mongolian text issues | Use Helvetica font, check PDF viewer |

## 📚 Related Docs

- `EBARIMT_RECEIPT_FORMAT.md` - Technical specification
- `EBARIMT_RECEIPT_USAGE.md` - Detailed usage guide
- `EBARIMT_RECEIPT_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `EBARIMT_RECEIPT_VISUAL_EXAMPLE.md` - Visual layout example
- `EBARIMT_IMPLEMENTATION.md` - E-Barimt integration guide

## 🔍 Checklist

### Implementation
- [x] PDF service updated
- [x] Controller updated with e-Barimt fields
- [x] A5 format implemented
- [x] 7 sections implemented
- [x] QR code generation
- [x] Lottery display
- [x] Build successful
- [x] Backend restarted

### Frontend TODO
- [ ] Add receipt buttons to order details
- [ ] Add download/view in order list
- [ ] Implement mobile sharing
- [ ] Add print functionality
- [ ] Show lottery prominently
- [ ] Test with real data

## 💻 Code Examples

### Complete Download Function

```typescript
const downloadReceipt = async (orderId: number) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(
      `${API_BASE_URL}/api/orders/${orderId}/receipt/pdf?download=true`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      }
    );
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('Receipt downloaded successfully');
  } catch (error) {
    console.error('Download failed:', error);
    alert('Баримт татахад алдаа гарлаа');
  }
};
```

### Print Function

```typescript
const printReceipt = (orderId: number) => {
  const token = localStorage.getItem('authToken');
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = `${API_BASE_URL}/api/orders/${orderId}/receipt/pdf`;
  
  document.body.appendChild(iframe);
  
  iframe.onload = () => {
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
};
```

## 🎯 Status

- **Implementation**: ✅ Complete
- **Testing**: ✅ Build passed
- **Documentation**: ✅ Complete
- **Backend**: ✅ Running
- **Ready**: ✅ Yes

---

**Last Updated**: December 13, 2025  
**Status**: Production Ready  
**Version**: 1.0

