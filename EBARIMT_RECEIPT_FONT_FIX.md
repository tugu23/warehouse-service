# E-Barimt Receipt - Cyrillic Encoding Fix

## Issue

The generated PDF shows garbled text for Mongolian Cyrillic characters because jsPDF's default Helvetica font doesn't support Cyrillic glyphs.

Example of issue:
- Expected: "Агуулахын бараа бүртгэлийн систем"
- Actual: "3CC;0EK= 10@00 1^@B3M;89= А"

## Solution Options

### Option 1: Add Custom Font to jsPDF (Recommended)

We need to add a TrueType font (.ttf) that supports Cyrillic characters.

1. Download a Cyrillic-supporting font (e.g., Roboto, Noto Sans, PT Sans)
2. Convert to base64 using jsPDF font converter
3. Add to jsPDF

**Implementation Steps:**

```bash
# Install font converter
npm install jspdf-font-converter --save-dev

# Convert TTF font to jsPDF format
node_modules/.bin/jspdf-font-converter path/to/Roboto-Regular.ttf

# This creates a .js file with base64 encoded font
```

Then in `pdf.service.ts`:

```typescript
import { jsPDF } from "jspdf";
import "./fonts/Roboto-Regular"; // Import converted font

// In the PDF generation:
doc.addFileToVFS("Roboto-Regular.ttf", ROBOTO_FONT_BASE64);
doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
doc.setFont("Roboto");
```

### Option 2: Use PDFKit (Server-Side Only)

PDFKit has built-in support for UTF-8 and Cyrillic characters.

**Status:** Implemented in `pdf-pdfkit.service.ts` but needs proper container setup.

### Option 3: Use HTML to PDF Conversion

Use `puppeteer` or `html-pdf` to convert HTML templates to PDF.

### Option 4: English Labels (Temporary Workaround)

Temporarily use English/Latin transliteration until proper font support is added:

```typescript
// Current (doesn't work):
"Агуулахын бараа бүртгэлийн систем"

// Temporary workaround:
"Aguulakhyn baraa burtgeliin sistem"
"Warehouse Goods Registration System"
```

## Recommended Solution

**Use Option 1 (Custom Font) + Roboto Font**

Roboto is:
- ✅ Free and open source (Apache License 2.0)
- ✅ Supports Cyrillic, Latin, Greek
- ✅ Professional appearance
- ✅ Good readability at small sizes
- ✅ Widely used and tested

## Implementation

### Step 1: Install Font Files

Download Roboto fonts and add to project:

```
src/
  fonts/
    Roboto-Regular.ttf
    Roboto-Bold.ttf
```

### Step 2: Convert Fonts

```bash
npm install jspdf-font-converter --save-dev

# Convert fonts
npx jspdf-font-converter src/fonts/Roboto-Regular.ttf
npx jspdf-font-converter src/fonts/Roboto-Bold.ttf
```

This creates JavaScript files with base64-encoded fonts.

### Step 3: Import in PDF Service

```typescript
import robotoRegular from "./fonts/Roboto-Regular";
import robotoBold from "./fonts/Roboto-Bold";

// Add fonts to PDF
doc.addFileToVFS("Roboto-Regular.ttf", robotoRegular);
doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

doc.addFileToVFS("Roboto-Bold.ttf", robotoBold);
doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

// Use font
doc.setFont("Roboto");
doc.text("Агуулахын бараа бүртгэлийн систем", x, y);
```

### Step 4: Update Docker Container

Add fonts to Dockerfile or install them at runtime.

## Alternative: Unicode Fallback

If custom fonts are too complex, use Unicode escape sequences:

```typescript
// Convert Mongolian text to Unicode escapes
const unicodeText = "\u0410\u0433\u0443\u0443\u043B\u0430\u0445...";
```

But this still requires a font that supports the Unicode range.

## Current Status

- ❌ Cyrillic text not displaying (garbled characters)
- ✅ PDF structure correct (7 sections, layout, QR code)
- ✅ English text displays correctly
- ✅ Numbers and Latin characters work
- ⏳ Need to add Cyrillic font support

## Next Steps

1. Download Roboto fonts (Regular + Bold)
2. Convert to jsPDF format using font converter
3. Update `pdf.service.ts` to import and use fonts
4. Test with Mongolian text
5. Update Docker container with font support

## Temporary Workaround

Until fonts are added, use bilingual labels:

```typescript
// Mongolian (will be garbled) + English (works)
doc.text("1. General Information / Баримтын ерөнхий мэдээлэл", x, y);
doc.text("Receipt Number / Зарлагын падаан №:", x, y);
```

Or use only English temporarily:

```typescript
doc.text("1. General Information", x, y);
doc.text("Receipt Number:", x, y);
doc.text("Registration Date:", x, y);
```

---

**Priority**: High  
**Complexity**: Medium  
**Impact**: Critical for Mongolian users  
**Estimated Time**: 2-3 hours with font conversion

