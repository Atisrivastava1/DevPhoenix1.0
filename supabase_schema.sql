-- DevPhoeniX Ecosystem - Production-Ready Standardized Supabase Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. PROGRAMS TABLE ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  overview TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  price TEXT NOT NULL,
  practical_hours TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL,
  outcomes TEXT[] NOT NULL DEFAULT '{}',
  projects INTEGER NOT NULL DEFAULT 0,
  
  curriculum JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  pricing_details JSONB DEFAULT '{}'::jsonb,
  tools TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 2. BLOGS TABLE ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_time TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  author JSONB NOT NULL DEFAULT '{"name": "Admin", "role": "Instructor", "avatar": ""}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 3. TESTIMONIALS TABLE ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  program TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 4. MENTORS TABLE ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online',
  avatar TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_verified BOOLEAN NOT NULL DEFAULT true,
  followers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 5. LEADS TABLE (CRM) ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  program TEXT NOT NULL DEFAULT '',
  current_status TEXT NOT NULL DEFAULT '',
  message TEXT,
  source_page TEXT DEFAULT '',
  source_campaign TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New',
  notes JSONB DEFAULT '[]'::jsonb,
  assigned_admin TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 6. SITE CONFIG TABLE (SINGLETON) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'global',
  hero JSONB NOT NULL,
  contact JSONB NOT NULL,
  socials JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 7. SHOWCASE TABLE ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.showcase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  author_name TEXT NOT NULL,
  program_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 8. VISUAL BLOCKS TABLE ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.visual_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  image_alt TEXT,
  badge TEXT,
  cta_text TEXT,
  cta_link TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  visibility BOOLEAN NOT NULL DEFAULT true,
  theme_variant TEXT NOT NULL DEFAULT 'glass',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 9. ADMIN USERS TABLE ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- ── 10. LEARNING PATHS TABLE ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  level TEXT DEFAULT 'All Levels',
  duration TEXT,
  image TEXT,
  included TEXT[] DEFAULT '{}',
  build JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  modules JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 11. INSERT INITIAL GLOBAL CONFIGURATION ───────────────────────────────────
INSERT INTO public.site_config (id, hero, contact, socials)
VALUES (
  'global',
  '{"badge":"The Elite Builder Ecosystem","headline1":"Learn. Build.","headline2":"Scale Faster.","subheadline":"Join a premium community of top 1% developers, founders, and creators building the future.","primaryCta":{"text":"Explore Programs","href":"/programs"},"secondaryCta":{"text":"Join Community","href":"/community"},"stats":[{"value":"1000+","label":"Active Builders"},{"value":"₹20M+","label":"Total Placements"},{"value":"50+","label":"Industry Mentors"}]}',
  '{"email":"hello@devphoenix.tech","phone":"+91 9876543210"}',
  '{"instagram":"#","linkedin":"#","facebook":"#","twitter":"#","github":"#"}'
) ON CONFLICT (id) DO NOTHING;

-- ── 12. ROW LEVEL SECURITY (RLS) POLICIES ─────────────────────────────────────
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to programs" ON public.programs;
CREATE POLICY "Allow public read-only access to programs" ON public.programs FOR SELECT USING (true);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to blogs" ON public.blogs;
CREATE POLICY "Allow public read-only access to blogs" ON public.blogs FOR SELECT USING (true);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to testimonials" ON public.testimonials;
CREATE POLICY "Allow public read-only access to testimonials" ON public.testimonials FOR SELECT USING (true);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to mentors" ON public.mentors;
CREATE POLICY "Allow public read-only access to mentors" ON public.mentors FOR SELECT USING (true);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to site config" ON public.site_config;
CREATE POLICY "Allow public read-only access to site config" ON public.site_config FOR SELECT USING (true);

ALTER TABLE public.showcase ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to showcase" ON public.showcase;
CREATE POLICY "Allow public read-only access to showcase" ON public.showcase FOR SELECT USING (true);

ALTER TABLE public.visual_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to visual blocks" ON public.visual_blocks;
CREATE POLICY "Allow public read-only access to visual blocks" ON public.visual_blocks FOR SELECT USING (true);

ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to learning_paths" ON public.learning_paths;
CREATE POLICY "Allow public read-only access to learning_paths" ON public.learning_paths FOR SELECT USING (true);

-- Leads and admin users tables are protected from public read access.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ── 13. STORAGE BUCKET CREATION & POLICIES ─────────────────────────────────────

-- Create public media bucket
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'media',
  'media',
  true,
  10485760,
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- PUBLIC READ ACCESS
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media');

-- AUTHENTICATED UPLOAD ACCESS
DROP POLICY IF EXISTS "Allow Authenticated Uploads" ON storage.objects;
CREATE POLICY "Allow Authenticated Uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- AUTHENTICATED DELETE ACCESS
DROP POLICY IF EXISTS "Allow Authenticated Deletes" ON storage.objects;
CREATE POLICY "Allow Authenticated Deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media');
