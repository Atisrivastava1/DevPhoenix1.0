# Frontend Component & UI Design Patterns

This document captures the premium design rules, spacing guidelines, and layout patterns for all UI components in the DevPhoeniX platform.

## 1. Cinematic Glassmorphism Design System

DevPhoeniX uses a bespoke, premium dark-mode-first styling hierarchy defined in `src/lib/design-system.ts`.

### Styling Guidelines
* **Harmonious Palettes**: Avoid harsh defaults. Use deep slate-grays (`#0d0f14`, `#151821`) for surfaces and vibrant, tailored orange-to-red gradients (`from-orange-500 to-red-500`) for CTA accents.
* **Rounded Corners**: Standardize layout corners using high-radius tokens:
  * Large panels / Cards: `rounded-2xl` or `rounded-[2rem]`
  * Action buttons / Inputs: `rounded-xl`
* **Micro-Animations**: We leverage `framer-motion` to make interfaces feel reactive and tactile. Enable scale-down feedback on press and subtle lifts on hover:
  ```typescript
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  ```

---

## 2. Reusable Core UI Components

To maintain perfect platform-wide visual consistency, developers should build screens using predefined base elements:

* **Button** (`src/components/ui/Button.tsx`): Primary cinematic actions and outlines.
* **Card** (`src/components/ui/Card.tsx`): Surfaces and borders leveraging the design token presets.
* **Badge** (`src/components/ui/Badge.tsx`): Pipeline badges, categories, and tags.
* **PremiumEmptyState** (`src/components/ui/PremiumEmptyState.tsx`): The standard elegant fallback view for empty lists or dashboards.

---

## 3. Form and Validation Best Practices

* **Inline Validation**: Provide precise errors at the input-field level rather than generic alert strings.
* **Disable State**: Set `disabled={loading}` on buttons during form submission to prevent concurrent request double-submits.
* **Auto-Trim**: Automatically trim spaces from titles, emails, and names inside handlers.
