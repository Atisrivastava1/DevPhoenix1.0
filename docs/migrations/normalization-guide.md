# Database Normalization & Migration Guide

This guide details the database field casing standardization, backward-compatibility mapping techniques, and structural refactoring policies executed during the stabilization phase.

## 1. Case-Matching Mapping Architecture

Due to PostgreSQL column limitations, standard database fields must use `snake_case`, while JavaScript and React components natively leverage `camelCase`.

To guarantee absolute interoperability without breaking old clients, the system implements a robust bidirectional mapping layer.

### Conversion Logic Table

| Database Key (`snake_case`) | Frontend Key (`camelCase`) | Default Value / Fallback |
| :--- | :--- | :--- |
| `practical_hours` | `practicalHours` | `""` |
| `pricing_details` | `pricingDetails` | `undefined` |
| `cover_image` | `coverImage` | `""` |
| `published_at` | `publishedAt` | Current ISO String |
| `read_time` | `readTime` | `"5 min read"` |
| `is_published` | `isPublished` | `true` |
| `github_url` | `githubUrl` | `""` |
| `live_url` | `liveUrl` | `""` |
| `author_name` | `authorName` | `""` |
| `program_name` | `programName` | `""` |
| `current_status` | `currentStatus` | `""` |
| `is_verified` | `isVerified` | `true` |

---

## 2. API Sanitizer Layer

All incoming payloads MUST pass through `src/lib/api/sanitize-payload.ts` before being mutated in Supabase or local cache.

### Example Sanitizer Implementation (Mentors)
```typescript
is_verified: typeof body.is_verified === "boolean" 
  ? body.is_verified 
  : (typeof body.isVerified === "boolean" ? body.isVerified : true)
```

By verifying both keys during sanitization, both old and new payloads are handled perfectly.

---

## 3. Strict Verification & Integrity Protocol

When deploying database schema changes or writing migrations:
1. Ensure column names in PostgreSQL precisely match `snake_case` definitions.
2. Confirm that TypeScript types in `src/types/index.ts` include both keys as optional/fully defined properties.
3. Proactively run `npx tsc --noEmit` locally to identify and rectify any casing drift before pushing to production branches.
