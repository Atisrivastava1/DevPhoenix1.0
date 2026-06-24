# CMS Architecture & Visual Block System

This document outlines the architecture of the DevPhoeniX Content Management System (CMS) and the dynamic Visual Block System.

## 1. CMS Core Principles

The DevPhoeniX CMS enables non-technical administrators to manage marketing copy, curricula, student showcases, leads, and graphic illustrations dynamically.

The CMS is built upon:
* **FormModal System**: A unified dialog-based component wrapper (`src/components/admin/FormModal.tsx`) providing standard validation, input elements, dropdowns, and load states.
* **ImagePicker Utility**: Unified, safe asset uploading and direct image URL insertion (`src/components/admin/ImagePicker.tsx`).
* **VisualBlockManager**: Dynamic landing-page block configuration module (`src/components/admin/VisualBlockManager.tsx`).

---

## 2. Dynamic Visual Block System

Instead of hardcoding illustrations, callouts, cards, or hero graphics, the frontend references "Visual Blocks" queried from the database by section-key.

```
┌────────────────────────────────────────────────────────┐
│                   VisualBlockManager                   │
└──────────────────────────┬─────────────────────────────┘
                           │ Saved to DB / Local Cache
                           ▼
┌────────────────────────────────────────────────────────┐
│             /api/visual-blocks Route                   │
└──────────────────────────┬─────────────────────────────┘
                           │ Serves Section Blocks
                           ▼
┌────────────────────────────────────────────────────────┐
│            VisualBlock Rendering Component             │
└────────────────────────────────────────────────────────┘
```

### Visual Block Schema
* **id**: (UUID / String)
* **section_key**: Identifies where the block is displayed (e.g. `homepage`, `showcase`, `programs`, `learning-paths`).
* **title**: Graphic heading or identifier.
* **subtitle**: Short tagline or secondary text.
* **image**: URL link to vector, icon, illustration, or banner.
* **link**: Target link when the graphic or card is clicked.
* **badge**: Accent label.
* **position**: Sort order ordering within the section.

---

## 3. Best Practices for Admin Views

1. **Graceful Reloading**: Always execute inline state updating locally before resolving API fetch states to guarantee snappy UI reactivity.
2. **Standard Toasts**: Utilize the `showToast` system from `@/components/ui/PremiumToast` rather than custom alerts.
3. **Empty States**: If a query returns no records, render `PremiumEmptyState` to present a unified fallback experience.
