# Database Architecture & Schema Standards

This document establishes the official database governance standards and active schema mapping rules for the DevPhoeniX platform.

## 1. Naming Convention Standards

To prevent schema drift and mapping errors between different application layers, we enforce strict naming conventions:

| Layer | Standard | Example |
| :--- | :--- | :--- |
| **PostgreSQL (Supabase)** | `snake_case` (All lower-case with underscores) | `practical_hours`, `pricing_details` |
| **Frontend React State & Forms** | `camelCase` (Standard JS convention) | `practicalHours`, `pricingDetails` |
| **API Endpoints (Requests/Responses)** | `snake_case` or bidirectional mapping | `current_status` / `currentStatus` |

> [!IMPORTANT]
> **Strict Rule**: Under no circumstances should raw JavaScript `camelCase` objects be pushed directly to Supabase mutations. All mutations MUST pass through the DB Service layer or a serializer to ensure exact column matching.

---

## 2. Table Schemas & Normalized Mappings

### `programs` Table
* **slug** (TEXT, Primary Key / Unique)
* **title** (TEXT)
* **description** (TEXT)
* **overview** (TEXT, Nullable)
* **category** (TEXT)
* **level** (TEXT)
* **duration** (TEXT)
* **type** (TEXT)
* **price** (TEXT)
* **practical_hours** (TEXT) — *Mapped to `practicalHours` on the frontend.*
* **pricing_details** (JSONB) — *Mapped to `pricingDetails` on the frontend.*
* **tags** (TEXT[])
* **image** (TEXT)
* **outcomes** (TEXT[])
* **projects** (INTEGER)
* **curriculum** (JSONB)
* **faqs** (JSONB)
* **tools** (TEXT[])
* **certifications** (TEXT[])

### `blogs` Table
* **id** (UUID / TEXT, Primary Key)
* **slug** (TEXT, Unique)
* **title** (TEXT)
* **excerpt** (TEXT)
* **content** (TEXT)
* **cover_image** (TEXT) — *Mapped to `coverImage` on the frontend.*
* **published_at** (TIMESTAMP) — *Mapped to `publishedAt` on the frontend.*
* **read_time** (TEXT) — *Mapped to `readTime` on the frontend.*
* **is_published** (BOOLEAN) — *Mapped to `isPublished` on the frontend.*
* **author** (JSONB)
* **tags** (TEXT[])

### `leads` Table
* **id** (UUID / TEXT, Primary Key)
* **name** (TEXT)
* **email** (TEXT)
* **phone** (TEXT)
* **program** (TEXT)
* **current_status** (TEXT) — *Mapped to `currentStatus` / `current_status` on the frontend.*
* **message** (TEXT, Nullable)
* **source_page** (TEXT)
* **source_campaign** (TEXT)
* **status** (TEXT) — *Pipeline status (`New`, `Contacted`, `Qualified`, etc.)*
* **notes** (JSONB)
* **assigned_admin** (TEXT, Nullable)
* **last_contacted_at** (TIMESTAMP, Nullable)

### `mentors` Table
* **id** (UUID / TEXT, Primary Key)
* **name** (TEXT)
* **role** (TEXT)
* **status** (TEXT) — *(`online`, `away`, `offline`)*
* **avatar** (TEXT)
* **tags** (TEXT[])
* **is_verified** (BOOLEAN) — *Mapped to `isVerified` on the frontend.*
* **followers** (INTEGER)

### `showcase` Table
* **id** (UUID / TEXT, Primary Key)
* **title** (TEXT)
* **description** (TEXT)
* **image** (TEXT)
* **tags** (TEXT[])
* **github_url** (TEXT) — *Mapped to `githubUrl` on the frontend.*
* **live_url** (TEXT) — *Mapped to `liveUrl` on the frontend.*
* **author_name** (TEXT) — *Mapped to `authorName` on the frontend.*
* **program_name** (TEXT) — *Mapped to `programName` on the frontend.*

---

## 3. Migration and Drift Prevention

1. **Local JSON Backups**: For local and disconnected development, `src/data/*.json` contains the seed data structure.
2. **Local Cache Files**: Runtime dynamic data resides in `.local_cache/*.json` inside the server context when Supabase is not configured.
3. **Database Client Verification**: We use the `hasSupabaseConfig` check to fail gracefully and switch to local cache if environment keys are missing, preventing system crashes.
