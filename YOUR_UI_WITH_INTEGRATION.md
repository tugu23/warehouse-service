# Одоогийн UI дээр харагдах байдал

## Таны Products хуудас дээр

### Өмнө нь (Integration-гүй):
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Products                                              [+ Add Product]       │
├─────────────────────────────────────────────────────────────────────────────┤
│ Name (EN)                | Name (MN)                | Stock | Category      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Buldak cheddar cheese    | Булдак анга cheese      │   0   │ Төрөл 12      │
│ cup 135g                 | 135гр                    │       │               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Buldak carbonara         | Булдак анга carbonara   │   0   │ Төрөл 12      │
│ cup 135g                 | 135гр                    │       │               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Buldak cheese 135g       | Булдак cheese 135гр     │   0   │ Төрөл 12      │
│                          |                          │       │               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Одоо (Integration-тэй):
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Products                                              [+ Add Product]       │
├─────────────────────────────────────────────────────────────────────────────┤
│ Name (EN)                | Name (MN)                | Stock | Wholesale     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Buldak cheddar cheese    | Булдак анга cheese      │   0   │ ₮0            │
│ cup 135g                 | 135гр                    │       │               │
│ 🔴 EXPIRED: 2018-04-24   | [1 batch]                │       │               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Buldak carbonara         | Булдак анга carbonara   │   0   │ ₮0            │
│ cup 135g                 | 135гр                    │       │               │
│ 🔴 EXPIRED: 2018-09-20   | [1 batch]                │       │               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Buldak cheese 135g       | Булдак cheese 135гр     │ 3068  │ ₮0            │
│                          |                          │       │               │
│ 🟢 GOOD: 2030-01-01      | [1 batch] 4+ years left │       │               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## API Response Example

### GET /api/products

**Хуучин (integration-гүй):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 422,
        "nameMongolian": "Дашида монго 1кг",
        "nameEnglish": "Mongo dashi 1kg",
        "stockQuantity": 0,
        "priceWholesale": 4686.00,
        "priceRetail": null
      }
    ]
  }
}
```

**Шинэ (integration-тэй):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 422,
        "nameMongolian": "Дашида монго 1кг",
        "nameEnglish": "Mongo dashi 1kg",
        "stockQuantity": 706,  ✅ UPDATED FROM VLDEGDEL
        "priceWholesale": 4686.00,
        "priceRetail": null,
        "batches": [           ✅ NEW: BATCH INFORMATION
          {
            "id": 1,
            "batchNumber": "BATCH-870-422",
            "arrivalDate": "2016-12-01T00:00:00.000Z",
            "expiryDate": "2018-04-24T00:00:00.000Z",
            "quantity": 706,
            "isActive": false   ✅ EXPIRED!
          }
        ]
      }
    ]
  }
}
```

## Таны хүснэгт дээр харагдах нэмэлт мэдээлэл

### Column нэмэгдлүүд:

1. **Expiry Status Badge** (Хугацааны статус)
   - 🟢 GOOD - 90+ хоног үлдсэн
   - 🔵 WARNING - 30-90 хоног үлдсэн
   - 🟡 CRITICAL - 0-30 хоног үлдсэн
   - 🔴 EXPIRED - Хугацаа дууссан

2. **Batch Count** (Багцын тоо)
   - [1 batch], [3 batches] гэх мэт

3. **Stock Quantity** (Үлдэгдэл)
   - vldegdel.json-аас автоматаар шинэчлэгдсэн

## Нэмэлт API Endpoints

Одоо ашиглаж болох шинэ endpoints:

```bash
# 1. Хугацаа дуусах гэж байгаа бараанууд (30 хоногт)
GET /api/products/batches/expiring?days=30

# Response:
{
  "status": "success",
  "data": {
    "batches": [
      {
        "batchNumber": "BATCH-870-422",
        "expiryDate": "2018-04-24",
        "quantity": 706,
        "product": {
          "id": 422,
          "nameMongolian": "Дашида монго 1кг"
        }
      }
    ],
    "count": 12
  }
}

# 2. Хугацаа дууссан бараанууд
GET /api/products/batches/expired

# 3. Статистик
GET /api/products/batches/stats

# Response:
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

## Frontend дээр харуулах жишээ

### React Component:

```tsx
function ProductRow({ product }: { product: Product }) {
  const earliestBatch = product.batches?.[0];
  const expiryStatus = getExpiryStatus(earliestBatch);
  
  return (
    <TableRow>
      <TableCell>
        <Box>
          <Typography>{product.nameMongolian}</Typography>
          {earliestBatch && (
            <Box display="flex" gap={1} mt={0.5}>
              <ExpiryBadge status={expiryStatus} date={earliestBatch.expiryDate} />
              <Chip 
                size="small" 
                label={`${product.batches.length} batch${product.batches.length > 1 ? 'es' : ''}`}
                variant="outlined"
              />
            </Box>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {product.stockQuantity}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>₮{product.priceWholesale || 0}</Typography>
      </TableCell>
    </TableRow>
  );
}
```

### ExpiryBadge Component:

```tsx
function ExpiryBadge({ status, date }: { status: ExpiryStatus, date: string }) {
  const configs = {
    expired: { icon: '🔴', label: 'EXPIRED', color: 'error' },
    critical: { icon: '🟡', label: 'CRITICAL', color: 'warning' },
    warning: { icon: '🔵', label: 'WARNING', color: 'info' },
    good: { icon: '🟢', label: 'GOOD', color: 'success' }
  };
  
  const config = configs[status];
  
  return (
    <Chip
      icon={<span>{config.icon}</span>}
      label={`${config.label}: ${formatDate(date)}`}
      color={config.color}
      size="small"
    />
  );
}
```

## Dashboard нэмэлт widget

```tsx
function ExpiryDashboard() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetch('/api/products/batches/stats')
      .then(res => res.json())
      .then(data => setStats(data.data));
  }, []);
  
  if (!stats) return <CircularProgress />;
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Typography color="error">🔴 Хугацаа дууссан</Typography>
            <Typography variant="h3">{stats.expired}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Typography color="warning">🟡 30 хоногт дуусах</Typography>
            <Typography variant="h3">{stats.expiring30Days}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Typography color="info">🔵 90 хоногт дуусах</Typography>
            <Typography variant="h3">{stats.expiring90Days}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Typography color="success">🟢 Сайн</Typography>
            <Typography variant="h3">{stats.healthy}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
```

## Таны Products хуудас дээр одоо харагдах байдал:

Таны зурган дээр харуулсан жагсаалт дээр:

1. **Buldak cheddar cheese cup 135g** (Stock: 0)
   - 🔴 EXPIRED: 2018-04-24
   - [1 batch] - 706 units хугацаа дууссан

2. **Buldak carbonara cup 135g** (Stock: 0)
   - 🔴 EXPIRED: 2018-09-20
   - [1 batch]

3. **Buldak original cup 124g** (Stock: 0)
   - 🔴 EXPIRED: 2017-12-30
   - [1 batch]

4. **Buldak cheddar cheese 135g** (Stock: 0)
   - 🔴 EXPIRED: 2030-12-30 ӨНӨӨДӨР!
   - [1 batch]

5. **Buldak cheese 135g** (Stock: 3068) ✅
   - 🟢 GOOD: 2030-01-01 (4+ жил үлдсэн)
   - [1 batch] - 3068 units

6. **Buldak original 124g** (Stock: 0)
   - [2 batches] - Хоёулаа хугацаа дууссан

7. **Kds Laver Salted 40g** (Stock: 0)
   - 🟢 GOOD: 2030-12-30
   - [1 batch]

8. **Dol Laver Salted 40g** (Stock: 0)
   - 🟢 GOOD: 2030-12-30
   - [1 batch]

9. **Baby Topokki cream 235g** (Stock: 0)
   - 🟢 GOOD: 2030-12-30
   - [1 batch]

10. **Baby Topokki mild spicy 220g** (Stock: 0)
    - 🟢 GOOD: 2030-12-30
    - [1 batch]

## Давуу тал:

✅ Бүтээгдэхүүн бүрийн хугацаа одоо харагдаж байна
✅ Үлдэгдэл автоматаар vldegdel.json-аас шинэчлэгдсэн
✅ Хугацаа дууссан бараа улаанаар тодорхой харагдана
✅ Багц бүрийг тус тусад нь хянаж болно
✅ API дээр бүх мэдээлэл бэлэн байна

Одоо та frontend дээрээ эдгээр мэдээллийг ашиглаж болно!

