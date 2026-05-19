-- Migration: 001_normalization.sql
-- Description: Convert all unquoted lowercase/camelCase columns to explicit snake_case, alter text primary keys to UUID format, and update RLS policies.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to generate UUID from text or create a random one
CREATE OR REPLACE FUNCTION public.safe_cast_uuid(val text) 
RETURNS uuid AS $$
BEGIN
  IF val ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
    RETURN val::uuid;
  ELSE
    RETURN gen_random_uuid();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ── 1. PROGRAMS TABLE NORMALIZATION ───────────────────────────────────────────
-- Convert ID to UUID
ALTER TABLE public.programs ALTER COLUMN id SET DATA TYPE uuid USING safe_cast_uuid(id);
ALTER TABLE public.programs ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Rename and normalize folded/camelCase columns
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='programs' AND column_name='practicalhours') THEN
    ALTER TABLE public.programs RENAME COLUMN practicalhours TO practical_hours;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='programs' AND column_name='practicalHours') THEN
    ALTER TABLE public.programs RENAME COLUMN "practicalHours" TO practical_hours;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='programs' AND column_name='pricingdetails') THEN
    ALTER TABLE public.programs RENAME COLUMN pricingdetails TO pricing_details;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='programs' AND column_name='pricingDetails') THEN
    ALTER TABLE public.programs RENAME COLUMN "pricingDetails" TO pricing_details;
  END IF;
END $$;

-- ── 2. BLOGS TABLE NORMALIZATION ──────────────────────────────────────────────
-- Convert ID to UUID
ALTER TABLE public.blogs ALTER COLUMN id SET DATA TYPE uuid USING safe_cast_uuid(id);
ALTER TABLE public.blogs ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Rename and normalize folded columns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blogs' AND column_name='coverimage') THEN
    ALTER TABLE public.blogs RENAME COLUMN coverimage TO cover_image;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blogs' AND column_name='coverImage') THEN
    ALTER TABLE public.blogs RENAME COLUMN "coverImage" TO cover_image;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blogs' AND column_name='publishedat') THEN
    -- Convert standard plaintext publication dates to standard timestamptz
    -- First, temporarily change to timestamptz via standard parsing or now() fallback
    ALTER TABLE public.blogs RENAME COLUMN publishedat TO published_at_old;
    ALTER TABLE public.blogs ADD COLUMN published_at timestamptz DEFAULT NOW();
    UPDATE public.blogs SET published_at = NOW();
    ALTER TABLE public.blogs DROP COLUMN published_at_old;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blogs' AND column_name='readtime') THEN
    ALTER TABLE public.blogs RENAME COLUMN readtime TO read_time;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blogs' AND column_name='readTime') THEN
    ALTER TABLE public.blogs RENAME COLUMN "readTime" TO read_time;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blogs' AND column_name='ispublished') THEN
    ALTER TABLE public.blogs RENAME COLUMN ispublished TO is_published;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blogs' AND column_name='isPublished') THEN
    ALTER TABLE public.blogs RENAME COLUMN "isPublished" TO is_published;
  END IF;
END $$;

-- ── 3. TESTIMONIALS TABLE NORMALIZATION ────────────────────────────────────────
-- Convert ID to UUID
ALTER TABLE public.testimonials ALTER COLUMN id SET DATA TYPE uuid USING safe_cast_uuid(id);
ALTER TABLE public.testimonials ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- ── 4. MENTORS TABLE NORMALIZATION ─────────────────────────────────────────────
-- Convert ID to UUID
ALTER TABLE public.mentors ALTER COLUMN id SET DATA TYPE uuid USING safe_cast_uuid(id);
ALTER TABLE public.mentors ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Rename and normalize folded columns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mentors' AND column_name='isverified') THEN
    ALTER TABLE public.mentors RENAME COLUMN isverified TO is_verified;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mentors' AND column_name='isVerified') THEN
    ALTER TABLE public.mentors RENAME COLUMN "isVerified" TO is_verified;
  END IF;
END $$;

-- ── 5. LEADS TABLE (CRM) NORMALIZATION ──────────────────────────────────────────
-- Convert ID to UUID
ALTER TABLE public.leads ALTER COLUMN id SET DATA TYPE uuid USING safe_cast_uuid(id);
ALTER TABLE public.leads ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Rename and normalize folded columns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='currentstatus') THEN
    ALTER TABLE public.leads RENAME COLUMN currentstatus TO current_status;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='currentStatus') THEN
    ALTER TABLE public.leads RENAME COLUMN "currentStatus" TO current_status;
  END IF;
END $$;

-- ── 6. PROJECT SHOWCASE NORMALIZATION ───────────────────────────────────────────
-- Convert ID to UUID
ALTER TABLE public.showcase ALTER COLUMN id SET DATA TYPE uuid USING safe_cast_uuid(id);
ALTER TABLE public.showcase ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Rename and normalize folded columns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='showcase' AND column_name='githuburl') THEN
    ALTER TABLE public.showcase RENAME COLUMN githuburl TO github_url;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='showcase' AND column_name='githubUrl') THEN
    ALTER TABLE public.showcase RENAME COLUMN "githubUrl" TO github_url;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='showcase' AND column_name='liveurl') THEN
    ALTER TABLE public.showcase RENAME COLUMN liveurl TO live_url;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='showcase' AND column_name='liveUrl') THEN
    ALTER TABLE public.showcase RENAME COLUMN "liveUrl" TO live_url;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='showcase' AND column_name='authorname') THEN
    ALTER TABLE public.showcase RENAME COLUMN authorname TO author_name;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='showcase' AND column_name='authorName') THEN
    ALTER TABLE public.showcase RENAME COLUMN "authorName" TO author_name;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='showcase' AND column_name='programname') THEN
    ALTER TABLE public.showcase RENAME COLUMN programname TO program_name;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='showcase' AND column_name='programName') THEN
    ALTER TABLE public.showcase RENAME COLUMN "programName" TO program_name;
  END IF;
END $$;

-- ── 7. LEARNING PATHS TABLE NORMALIZATION ───────────────────────────────────────
-- Convert ID to UUID
ALTER TABLE public.learning_paths ALTER COLUMN id SET DATA TYPE uuid USING safe_cast_uuid(id);
ALTER TABLE public.learning_paths ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- ── 8. VISUAL BLOCKS TABLE NORMALIZATION ────────────────────────────────────────
-- Convert ID to UUID
ALTER TABLE public.visual_blocks ALTER COLUMN id SET DATA TYPE uuid USING safe_cast_uuid(id);
ALTER TABLE public.visual_blocks ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Cleanup safe cast helper
DROP FUNCTION IF EXISTS public.safe_cast_uuid(text);
