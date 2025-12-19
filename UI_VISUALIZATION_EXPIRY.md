# UI харагдах байдал - Бүтээгдэхүүний хугацаа интеграци

## Бүтээгдэхүүний жагсаалт

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Products                                       [Search...] [+ Add Product]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌───────────────────────────────────────────────────────────────────────┐  │
│ │ Name (EN)              | Name (MN)              | Stock | Category    │  │
│ ├───────────────────────────────────────────────────────────────────────┤  │
│ │ Buldak cheddar cheese  | Булдак анга cheese    │  0    │ Төрөл 12    │  │
│ │ cup 135g               | 135гр                  │       │             │  │
│ │ 🔴 Expired             |                        │       │             │  │
│ ├───────────────────────────────────────────────────────────────────────┤  │
│ │ Buldak carbonara       | Булдак анга carbonara │  0    │ Төрөл 12    │  │
│ │ cup 135g               | 135гр                  │       │             │  │
│ │ 🔴 Expired             |                        │       │             │  │
│ ├───────────────────────────────────────────────────────────────────────┤  │
│ │ Buldak original        | Булдак анга original  │  0    │ Төрөл 12    │  │
│ │ cup 124g               | 124гр                  │       │             │  │
│ │ 🔴 Expired             |                        │       │             │  │
│ ├───────────────────────────────────────────────────────────────────────┤  │
│ │ Buldak cheese 135g     | Булдак cheese 135гр   │ 3068  │ Төрөл 12    │  │
│ │ 🟢 Good (4+ years)     | [1 batch]             │       │             │  │
│ ├───────────────────────────────────────────────────────────────────────┤  │
│ │ Kds Laver Salted 40g   | Нүнтаг гим kids 40гр  │ 1186  │ Төрөл 12    │  │
│ │ 🟢 Good                | [1 batch]             │       │             │  │
│ └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│ Showing 1-10 of 840 products                               [1][2][3]...[84]│
└─────────────────────────────────────────────────────────────────────────────┘
```

## Dashboard - Хугацааны статистик

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Expiry Status Dashboard                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │ 🔴 Expired    │  │ 🟡 30 Days    │  │ 🔵 90 Days    │  │ 🟢 Healthy  │ │
│  │               │  │               │  │               │  │             │ │
│  │      156      │  │      12       │  │      45       │  │     227     │ │
│  │               │  │               │  │               │  │             │ │
│  │  products     │  │  products     │  │  products     │  │  products   │ │
│  └───────────────┘  └───────────────┘  └───────────────┘  └─────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Expiring Soon (Next 30 Days)                                        │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ • Дашида монго 1кг - 10 days left (706 units)                       │   │
│  │ • Гучужан 170гр - 15 days left (0 units) 🔴 Out of stock           │   │
│  │ • Baby Topokki cream 235g - 25 days left (0 units) 🔴 Out of stock │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Бүтээгдэхүүний дэлгэрэнгүй

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Product Details: Булдак cheese 135гр                           [Edit] [✕]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  General Information                                                        │
│  ━━━━━━━━━━━━━━━━━━━━                                                       │
│  Mongolian Name:  Булдак cheese 135гр                                      │
│  English Name:    Buldak cheese 135g                                        │
│  Category:        Төрөл 12                                                 │
│  Stock:           3068 units                                                │
│  Price (Retail):  ₮0                                                        │
│  Price (Wholesale): ₮0                                                      │
│                                                                             │
│  Batches (1)                                                                │
│  ━━━━━━━━━━━━━━━━━━━━                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │ Batch: BATCH-876-426                                              │     │
│  │ Status: 🟢 Active                                                 │     │
│  │                                                                   │     │
│  │ Arrival Date:     2016-11-04                                      │     │
│  │ Expiry Date:      2030-01-01  🟢 4+ years remaining              │     │
│  │ Quantity:         3068 units                                      │     │
│  │ Storage Duration: 12 months                                       │     │
│  │                                                                   │     │
│  │                                            [Mark as Inactive] [✏️] │     │
│  └───────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  Stock History                                                              │
│  ━━━━━━━━━━━━━━━━━━━━                                                       │
│  📊 Initial import: +3068 units (2024-12-20)                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Борлуулалтын дэлгэцэнд

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ New Order                                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Customer:  [Select Customer ▼]                                            │
│  Date:      2024-12-20                                                      │
│                                                                             │
│  Products:                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Product               │ Qty │ Unit Price │ Total │ Expiry Status   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ Булдак cheese 135гр   │ 100 │ ₮0        │ ₮0    │ 🟢 Good        │   │
│  │ [Batch: BATCH-876-426 | Available: 3068]                           │   │
│  │                                                                     │   │
│  │ [+ Add Product]                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Total Amount: ₮0                                                           │
│                                                                             │
│  [Cancel]                                               [Create Order]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Анхааруулгын notification

```
┌─────────────────────────────────────────────────────┐
│ 🔔 Notifications                              [×]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 🔴 12 products expiring in 30 days                  │
│    View Details →                                   │
│                                                     │
│ ⚠️  156 products have expired                       │
│    Review Now →                                     │
│                                                     │
│ ℹ️  3068 units of "Булдак cheese 135гр" in stock   │
│    Batch expires: 2030-01-01                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Mobile view

```
┌──────────────────────────┐
│ ≡  Products      [🔍]    │
├──────────────────────────┤
│                          │
│ ┌──────────────────────┐ │
│ │ Булдак cheese 135гр  │ │
│ │ Stock: 3068          │ │
│ │ 🟢 Expires: 2030-01  │ │
│ │ 1 batch              │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ Дашида монго 1кг     │ │
│ │ Stock: 706           │ │
│ │ 🔴 Expired           │ │
│ │ 1 batch              │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ Гучужан 170гр        │ │
│ │ Stock: 0             │ │
│ │ 🔴 Expired           │ │
│ │ Out of stock         │ │
│ └──────────────────────┘ │
│                          │
└──────────────────────────┘
```

## Хугацааны статус өнгө

### 🟢 Good (90+ days)
- Color: Green (#4CAF50)
- Background: Light green (#E8F5E9)
- Action: None required

### 🔵 Warning (30-90 days)
- Color: Blue (#2196F3)
- Background: Light blue (#E3F2FD)
- Action: Monitor closely

### 🟡 Critical (0-30 days)
- Color: Orange/Amber (#FF9800)
- Background: Light orange (#FFF3E0)
- Action: Prioritize sales

### 🔴 Expired (Past expiry date)
- Color: Red (#F44336)
- Background: Light red (#FFEBEE)
- Action: Remove from stock

### ⚪ No Expiry
- Color: Gray (#9E9E9E)
- Background: Light gray (#F5F5F5)
- Action: None

## Тайлангийн харагдах байдал

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Expiry Report - December 2024                                [Export] [📄] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Summary                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━                                                       │
│  Total Products:       840                                                  │
│  Total Batches:        462                                                  │
│                                                                             │
│  Status Breakdown:                                                          │
│  • 🟢 Good (90+ days):        227 products (53%)                            │
│  • 🔵 Warning (30-90 days):    45 products (11%)                            │
│  • 🟡 Critical (0-30 days):    12 products (3%)                             │
│  • 🔴 Expired:                156 products (37%)                            │
│                                                                             │
│  Top Expiring Products                                                      │
│  ━━━━━━━━━━━━━━━━━━━━                                                       │
│  1. Дашида монго 1кг              - 10 days  (706 units)                   │
│  2. Гучужан 170гр                 - 15 days  (0 units) ⚠️                  │
│  3. Baby Topokki cream 235g       - 25 days  (0 units) ⚠️                  │
│                                                                             │
│  Recommended Actions                                                        │
│  ━━━━━━━━━━━━━━━━━━━━                                                       │
│  • Prioritize sales for 12 products expiring in 30 days                    │
│  • Review 156 expired products for disposal                                │
│  • Restock 3 critical items with zero inventory                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Excel тайлан

```
A                          B            C               D              E
Product Name              Stock        Expiry Date     Days Left      Status
─────────────────────────────────────────────────────────────────────────────
Булдак cheese 135гр       3068         2030-01-01      1832           🟢 Good
Дашида монго 1кг          706          2018-04-24      -2431          🔴 Expired
Гучужан 170гр             0            2018-03-01      -2485          🔴 Expired
Baby Topokki cream 235g   0            2030-12-30      2197           🟢 Good
Kds Laver Salted 40g      1186         2030-12-30      2197           🟢 Good
...
```

## Chart visualization

```
Expiry Distribution
━━━━━━━━━━━━━━━━━━━━

🟢 Good (227)        ████████████████████████████████████  53%
🔵 Warning (45)      ███████                              11%
🟡 Critical (12)     ██                                    3%
🔴 Expired (156)     ████████████████████                 37%

Stock by Status
━━━━━━━━━━━━━━━━━━━━

Good:      15,234 units
Warning:    2,145 units
Critical:     456 units
Expired:        0 units (removed from active stock)
```

## Өнгөний схем (Tailwind CSS)

```css
/* Good */
.status-good {
  @apply bg-green-100 text-green-800 border-green-300;
}

/* Warning */
.status-warning {
  @apply bg-blue-100 text-blue-800 border-blue-300;
}

/* Critical */
.status-critical {
  @apply bg-amber-100 text-amber-800 border-amber-300;
}

/* Expired */
.status-expired {
  @apply bg-red-100 text-red-800 border-red-300;
}

/* No expiry */
.status-no-expiry {
  @apply bg-gray-100 text-gray-600 border-gray-300;
}
```

## MUI Theme

```typescript
const expiryStatusTheme = {
  good: {
    main: '#4CAF50',
    light: '#E8F5E9',
    dark: '#388E3C',
  },
  warning: {
    main: '#2196F3',
    light: '#E3F2FD',
    dark: '#1976D2',
  },
  critical: {
    main: '#FF9800',
    light: '#FFF3E0',
    dark: '#F57C00',
  },
  expired: {
    main: '#F44336',
    light: '#FFEBEE',
    dark: '#D32F2F',
  },
};
```

Эдгээр UI жишээнүүдийг ашиглан фронтенд дээрээ харагдах байдлыг хэрэгжүүлж болно!

