# Хурдан эхлэх - Бүтээгдэхүүний хугацаа мэдээллийн интеграци

## 1. Өгөгдөл оруулах

### Алхам 1: Бүтээгдэхүүн оруулах
```bash
npm run seed:baraa
```

Энэ нь `prisma/parsed-data/baraa.json` файлаас бүх бүтээгдэхүүнийг database-д оруулна.

### Алхам 2: Үлдэгдэл, хугацаа мэдээлэл оруулах
```bash
npm run seed:vldegdel
```

Энэ нь `prisma/parsed-data/vldegdel.json` файлаас:
- Бүтээгдэхүүний үлдэгдлийг (stock quantity)
- Үйлдвэрлэсэн огноо (arrival date)
- Дуусах хугацааг (expiry date)
- Багц (batch) мэдээллийг оруулна

## 2. Серверийг асаах

```bash
npm run dev
```

Серверийг асаасны дараа [http://localhost:3000/api-docs](http://localhost:3000/api-docs) хаягаас API документацийг харж болно.

## 3. API Endpoints

### Бүтээгдэхүүний жагсаалт (Batch мэдээлэлтэй)

```bash
# Бүх бүтээгдэхүүн авах
GET http://localhost:3000/api/products

# Хайлт хийх
GET http://localhost:3000/api/products?search=булдак

# Хуудаслалт
GET http://localhost:3000/api/products?page=1&limit=20
```

**Response жишээ:**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 426,
        "nameMongolian": "Булдак cheese 135гр",
        "stockQuantity": 3068,
        "batches": [
          {
            "batchNumber": "BATCH-876-426",
            "arrivalDate": "2016-11-04T00:00:00.000Z",
            "expiryDate": "2030-01-01T00:00:00.000Z",
            "quantity": 3068,
            "isActive": true
          }
        ]
      }
    ]
  }
}
```

### Хугацаа дуусах гэж байгаа бараанууд

```bash
# 30 хоногт дуусах бараанууд (default)
GET http://localhost:3000/api/products/batches/expiring

# 90 хоногт дуусах бараанууд
GET http://localhost:3000/api/products/batches/expiring?days=90
```

### Хугацаа дууссан бараанууд

```bash
GET http://localhost:3000/api/products/batches/expired
```

### Хугацааны статистик

```bash
GET http://localhost:3000/api/products/batches/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "expired": 156,
    "expiring30Days": 12,
    "expiring90Days": 45,
    "total": 428,
    "healthy": 227
  }
}
```

## 4. Тохиргоо

### Environment Variables

`.env` файлд дараах тохиргоо шаардлагатай:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/warehouse"
PORT=3000
NODE_ENV=development
```

## 5. Frontend интеграци жишээ

### React/TypeScript жишээ

```typescript
interface ProductBatch {
  id: number;
  batchNumber: string;
  arrivalDate: string;
  expiryDate: string | null;
  quantity: number;
  isActive: boolean;
}

interface Product {
  id: number;
  nameMongolian: string;
  stockQuantity: number;
  batches?: ProductBatch[];
}

// API дуудах
const fetchProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data.data.products;
};

// Хугацааны статус тодорхойлох
const getExpiryStatus = (batch: ProductBatch) => {
  if (!batch.expiryDate) return 'no-expiry';
  
  const today = new Date();
  const expiryDate = new Date(batch.expiryDate);
  const daysUntilExpiry = Math.floor(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry < 30) return 'critical';
  if (daysUntilExpiry < 90) return 'warning';
  return 'good';
};

// Component
function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.nameMongolian}</h3>
          <p>Үлдэгдэл: {product.stockQuantity}</p>
          {product.batches && product.batches.length > 0 && (
            <div>
              <h4>Багцууд:</h4>
              {product.batches.map(batch => {
                const status = getExpiryStatus(batch);
                return (
                  <div key={batch.id} className={`batch-${status}`}>
                    <span>{batch.batchNumber}</span>
                    <span>Тоо: {batch.quantity}</span>
                    {batch.expiryDate && (
                      <span>
                        Дуусах: {new Date(batch.expiryDate).toLocaleDateString('mn-MN')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### MUI Component жишээ

```tsx
import { Chip, Box, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ExpiryChip({ batch }: { batch: ProductBatch }) {
  const status = getExpiryStatus(batch);
  
  const configs = {
    expired: {
      label: 'Хугацаа дууссан',
      color: 'error' as const,
      icon: <ErrorIcon />
    },
    critical: {
      label: '30 хоног үлдсэн',
      color: 'error' as const,
      icon: <WarningIcon />
    },
    warning: {
      label: '90 хоног үлдсэн',
      color: 'warning' as const,
      icon: <WarningIcon />
    },
    good: {
      label: 'Хугацаа сайн',
      color: 'success' as const,
      icon: <CheckCircleIcon />
    },
    'no-expiry': {
      label: 'Хугацаагүй',
      color: 'default' as const,
      icon: null
    }
  };
  
  const config = configs[status];
  
  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      icon={config.icon}
    />
  );
}
```

## 6. Dashboard Widget жишээ

```tsx
function ExpiryDashboard() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetch('http://localhost:3000/api/products/batches/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data.data));
  }, []);
  
  if (!stats) return <div>Ачааллаж байна...</div>;
  
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">Хугацаа дууссан</Typography>
          <Typography variant="h3" color="error">{stats.expired}</Typography>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6">30 хоногт дуусах</Typography>
          <Typography variant="h3" color="warning">{stats.expiring30Days}</Typography>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6">90 хоногт дуусах</Typography>
          <Typography variant="h3" color="info">{stats.expiring90Days}</Typography>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6">Сайн байгаа</Typography>
          <Typography variant="h3" color="success">{stats.healthy}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
```

## 7. Тайлан авах

```bash
# Postman эсвэл curl ашиглан тайлан авах
curl -X GET "http://localhost:3000/api/products/batches/expiring?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 8. Анхааруулга

⚠️ **Анхааруулах зүйлс:**

1. API endpoints бүгд authentication шаарддаг (`Bearer token`)
2. Хугацаа дууссан багцууд автоматаар `isActive = false` болдоггүй, гараар шинэчлэх шаардлагатай
3. Stock quantity нь бүх batch-ийн нийлбэр
4. Багц устгах боломжгүй, зөвхөн deactivate хийж болно

## 9. Дараагийн алхмууд

- [ ] Frontend дээр хугацааны анхааруулга харуулах
- [ ] Email/SMS notification илгээх хугацаа дуусах гэж байгаа бараанд
- [ ] Тайлан автоматаар үүсгэх (өдөр бүр)
- [ ] Batch-аар борлуулалт хийх (FEFO - First Expired First Out)
- [ ] QR/Barcode scanner нэмж batch сонгох

## Тусламж

Асуудал гарвал:
1. Логууд: `logs/combined.log`, `logs/error.log`
2. Database check: `npm run prisma:studio`
3. API docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

