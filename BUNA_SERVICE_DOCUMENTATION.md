# BUNA Service - Бараа, Үйлчилгээний Нэгдсэн Ангилал

## Overview

The BUNA (Unified Classification of Goods and Services) service provides integration with Mongolia's E-Barimt product classification system. It allows you to browse the hierarchical classification structure and find BUNA codes for products.

## BUNA Code Structure

BUNA codes are **7-digit hierarchical classification codes**:

```
0111100
│││││││
││││││└─ Individual code digit
│││││└── Code digit  
││││└─── Subclass (5th digit)
│││└──── Class (5th digit)  
││└───── Group (4 digits total: 0111)
│└────── Subsector (3 digits total: 011)
└─────── Sector (2 digits total: 01)
```

### Hierarchy Levels:

1. **Level 1: Sector (Салбар)** - 2 digits (e.g., "01" = Agriculture)
2. **Level 2: Subsector (Дэд салбар)** - 3 digits (e.g., "011" = Grain seeds)
3. **Level 3: Group (Бүлэг)** - 4 digits (e.g., "0111" = Red wheat)
4. **Level 4: Class (Анги)** - 5 digits (e.g., "01111" = Red wheat, seed type)
5. **Level 5: Subclass (Дэд анги)** - 5 digits (same as class in structure)
6. **Level 6: BUNA Code** - 7 digits (e.g., "0111100" = Red wheat seed)
7. **Level 7: Barcodes** - Product barcodes linked to BUNA codes

## API Endpoints

### 1. Get Sectors (Level 1)
```http
GET /api/buna/sectors
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "01",
      "name": "Хөдөө аж ахуйн бүтээгдэхүүн, цэцэрлэгжүүлэлт"
    },
    {
      "code": "02",
      "name": "Мал, амьтан, тэдгээрийн гаралтай бүтээгдэхүүн махыг оруулахгүйгээр"
    }
  ],
  "level": "sector"
}
```

### 2. Get Subsectors (Level 2)
```http
GET /api/buna/subsectors/:sector
```

**Example:**
```http
GET /api/buna/subsectors/01
```

### 3. Get Groups (Level 3)
```http
GET /api/buna/groups/:sector/:subsector
```

**Example:**
```http
GET /api/buna/groups/01/011
```

### 4. Get Classes (Level 4)
```http
GET /api/buna/classes/:sector/:subsector/:group
```

**Example:**
```http
GET /api/buna/classes/01/011/0111
```

### 5. Get Subclasses (Level 5)
```http
GET /api/buna/subclasses/:sector/:subsector/:group/:class
```

**Example:**
```http
GET /api/buna/subclasses/01/011/0111/01111
```

### 6. Get BUNA Codes (Level 6)
```http
GET /api/buna/codes/:sector/:subsector/:group/:class/:subclass
```

**Example:**
```http
GET /api/buna/codes/01/011/0111/01111/01111
```

### 7. Get Barcodes (Level 7)
```http
GET /api/buna/barcodes/:sector/:subsector/:group/:class/:subclass/:buna
```

**Example:**
```http
GET /api/buna/barcodes/01/011/0111/01111/01111/0111100
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "800888883000",
      "name": "Тест",
      "addedDate": "2022-07-17"
    }
  ],
  "level": "barcode"
}
```

### 8. Search by Barcode
```http
GET /api/buna/search/barcode/:barcode
```

**Example:**
```http
GET /api/buna/search/barcode/8809832941022
```

**Response:**
```json
{
  "success": true,
  "data": {
    "barcode": "8809832941022",
    "productName": "Baby Topokki cream 235g",
    "bunaCode": "0111100",
    "addedDate": "2022-07-17",
    "fullPath": {
      "sector": "01",
      "subsector": "011",
      "group": "0111",
      "class": "01111",
      "subclass": "01111",
      "buna": "0111100"
    }
  }
}
```

⚠️ **Note:** This endpoint searches through the entire BUNA hierarchy, so it may be slow. Results are cached for 24 hours.

### 9. Get Classification Path
```http
GET /api/buna/path/:bunaCode
```

**Example:**
```http
GET /api/buna/path/0111100
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sector": {
      "code": "01",
      "name": "Хөдөө аж ахуйн бүтээгдэхүүн"
    },
    "subsector": {
      "code": "011",
      "name": "Үр тариа"
    },
    "group": {
      "code": "0111",
      "name": "Улаан буудай"
    },
    "class": {
      "code": "01111",
      "name": "Улаан буудай, үрийн"
    },
    "subclass": {
      "code": "01111",
      "name": "Улаан буудай, үрийн"
    },
    "buna": {
      "code": "0111100",
      "name": "Улаан буудай үрийн"
    }
  }
}
```

### 10. Clear Cache
```http
POST /api/buna/cache/clear
```

**Response:**
```json
{
  "success": true,
  "message": "BUNA cache cleared successfully"
}
```

## Usage in Code

### Import the service
```typescript
import bunaService from './services/buna.service';
```

### Get sectors
```typescript
const sectors = await bunaService.getSectors();
console.log(sectors);
```

### Navigate the hierarchy
```typescript
// Get subsectors for agriculture sector
const subsectors = await bunaService.getSubsectors('01');

// Get groups for grain seeds
const groups = await bunaService.getGroups('01', '011');

// Get all levels for a specific path
const bunaCodes = await bunaService.getBunaCodes('01', '011', '0111', '01111', '01111');
```

### Search by barcode
```typescript
const result = await bunaService.searchByBarcode('8809832941022');
if (result) {
  console.log(`Product: ${result.productName}`);
  console.log(`BUNA Code: ${result.bunaCode}`);
}
```

### Get classification path
```typescript
const path = await bunaService.getClassificationPath('0111100');
if (path) {
  console.log(`Sector: ${path.sector.name}`);
  console.log(`BUNA: ${path.buna.name}`);
}
```

## Integration with Products

### Adding BUNA codes to products

When creating or updating products, you can add the `classificationCode` field:

```typescript
await prisma.product.update({
  where: { id: productId },
  data: {
    classificationCode: '0111100', // 7-digit BUNA code
  },
});
```

### Validating BUNA codes

```typescript
const bunaCode = '0111100';
const path = await bunaService.getClassificationPath(bunaCode);

if (!path) {
  throw new Error('Invalid BUNA code');
}

// Use the validated code
await prisma.product.update({
  where: { id: productId },
  data: {
    classificationCode: bunaCode,
  },
});
```

## Caching

The BUNA service automatically caches API responses for **24 hours** to improve performance and reduce API calls. The cache is stored in memory and will be cleared when the server restarts.

To manually clear the cache:
```http
POST /api/buna/cache/clear
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `404` - Resource not found (invalid code or barcode)
- `500` - Server error (API unavailable, network error, etc.)

## Best Practices

1. **Use caching**: The service caches responses automatically, but you can also implement your own caching layer for frequently accessed data.

2. **Handle errors gracefully**: Always wrap API calls in try-catch blocks.

3. **Validate BUNA codes**: Before saving a BUNA code to your database, validate it using `getClassificationPath()`.

4. **Progressive loading**: When building a UI, load levels progressively (sector → subsector → group → etc.) instead of loading everything at once.

5. **Search optimization**: The `searchByBarcode()` method is slow. If you need frequent lookups, consider building your own barcode→BUNA mapping table.

## Example: Product Classification Workflow

```typescript
// 1. User selects a sector
const sectors = await bunaService.getSectors();
const selectedSector = '01'; // User selects agriculture

// 2. User selects a subsector
const subsectors = await bunaService.getSubsectors(selectedSector);
const selectedSubsector = '011'; // User selects grain seeds

// 3. Continue drilling down...
const groups = await bunaService.getGroups(selectedSector, selectedSubsector);
const classes = await bunaService.getClasses(selectedSector, selectedSubsector, '0111');
const subclasses = await bunaService.getSubclasses(selectedSector, selectedSubsector, '0111', '01111');
const bunaCodes = await bunaService.getBunaCodes(selectedSector, selectedSubsector, '0111', '01111', '01111');

// 4. User selects a BUNA code
const selectedBunaCode = '0111100';

// 5. Save to product
await prisma.product.update({
  where: { id: productId },
  data: {
    classificationCode: selectedBunaCode,
  },
});
```

## External API Reference

The BUNA service uses the official E-Barimt API:
```
https://api.ebarimt.mn/api/info/check/barcode/v2/{p4}/{p5}/{p1}/{p2}/{p3}/{p6}
```

Where:
- `p1` = sector (0 for sectors list)
- `p2` = subsector (0 for subsectors list)
- `p3` = group (0 for groups list)
- `p4` = class (0 for classes list)
- `p5` = subclass (0 for subclasses list)
- `p6` = BUNA code (0 for BUNA codes list)

## Troubleshooting

### Issue: "Failed to fetch BUNA sectors"
**Solution**: Check your internet connection and verify that `https://api.ebarimt.mn` is accessible.

### Issue: "BUNA code X not found"
**Solution**: The code may be invalid or not yet registered in the E-Barimt system. Verify the code structure (must be 7 digits).

### Issue: Slow barcode search
**Solution**: The `searchByBarcode()` method traverses the entire hierarchy. For production use, consider building a local barcode index or using a dedicated search service.

### Issue: Cache grows too large
**Solution**: The cache is cleared automatically after 24 hours. You can also manually clear it via the API endpoint or restart the server.
