-- Migration Rollback: 001_rollback.sql
-- Description: Safety rollback script to revert explicit snake_case names and UUID conversions.

-- ── 1. REVERT PROGRAMS TABLE ───────────────────────────────────────────────────
ALTER TABLE public.programs ALTER COLUMN id SET DATA TYPE text;
ALTER TABLE public.programs ALTER COLUMN id DROP DEFAULT;

ALTER TABLE public.programs RENAME COLUMN practical_hours TO "practicalHours";
ALTER TABLE public.programs RENAME COLUMN pricing_details TO "pricingDetails";

-- ── 2. REVERT BLOGS TABLE ──────────────────────────────────────────────────────
ALTER TABLE public.blogs ALTER COLUMN id SET DATA TYPE text;
ALTER TABLE public.blogs ALTER COLUMN id DROP DEFAULT;

ALTER TABLE public.blogs RENAME COLUMN cover_image TO "coverImage";
ALTER TABLE public.blogs RENAME COLUMN read_time TO "readTime";
ALTER TABLE public.blogs RENAME COLUMN is_published TO "isPublished";

-- Revert published_at column back to plain text date format
ALTER TABLE public.blogs RENAME COLUMN published_at TO published_at_tz;
ALTER TABLE public.blogs ADD COLUMN "publishedAt" text DEFAULT '2023-12-15';
UPDATE public.blogs SET "publishedAt" = COALESCE(published_at_tz::text, '2023-12-15');
ALTER TABLE public.blogs DROP COLUMN published_at_tz;

-- ── 3. REVERT TESTIMONIALS TABLE ───────────────────────────────────────────────
ALTER TABLE public.testimonials ALTER COLUMN id SET DATA TYPE text;
ALTER TABLE public.testimonials ALTER COLUMN id DROP DEFAULT;

-- ── 4. REVERT MENTORS TABLE ────────────────────────────────────────────────────
ALTER TABLE public.mentors ALTER COLUMN id SET DATA TYPE text;
ALTER TABLE public.mentors ALTER COLUMN id DROP DEFAULT;

ALTER TABLE public.mentors RENAME COLUMN is_verified TO "isVerified";

-- ── 5. REVERT LEADS TABLE ──────────────────────────────────────────────────────
ALTER TABLE public.leads ALTER COLUMN id SET DATA TYPE text;
ALTER TABLE public.leads ALTER COLUMN id DROP DEFAULT;

ALTER TABLE public.leads RENAME COLUMN current_status TO "currentStatus";

-- ── 6. REVERT SHOWCASE TABLE ───────────────────────────────────────────────────
ALTER TABLE public.showcase ALTER COLUMN id SET DATA TYPE text;
ALTER TABLE public.showcase ALTER COLUMN id DROP DEFAULT;

ALTER TABLE public.showcase RENAME COLUMN github_url TO "githubUrl";
ALTER TABLE public.showcase RENAME COLUMN live_url TO "liveUrl";
ALTER TABLE public.showcase RENAME COLUMN author_name TO "authorName";
ALTER TABLE public.showcase RENAME COLUMN program_name TO "programName";

-- ── 7. REVERT LEARNING PATHS TABLE ─────────────────────────────────────────────
ALTER TABLE public.learning_paths ALTER COLUMN id SET DATA TYPE text;
ALTER TABLE public.learning_paths ALTER COLUMN id DROP DEFAULT;

-- ── 8. REVERT VISUAL BLOCKS TABLE ──────────────────────────────────────────────
ALTER TABLE public.visual_blocks ALTER COLUMN id SET DATA TYPE text;
ALTER TABLE public.visual_blocks ALTER COLUMN id DROP DEFAULT;
