import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey);
export const hasAdminConfig = !!(supabaseUrl && supabaseServiceRoleKey);

if (!hasSupabaseConfig) {
  console.warn('⚠️ SUPABASE CREDENTIALS MISSING: Running in disconnected mode. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local to connect to the database.');
}

if (!hasAdminConfig) {
  console.warn('⚠️ SUPABASE SERVICE ROLE KEY MISSING: Server-side RLS bypass client is unavailable. Add SUPABASE_SERVICE_ROLE_KEY to your .env.local.');
}

// Client-side public client (subject to RLS policies)
export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE1MzYwMDAsImV4cCI6MTk4NzExMzYwMH0.placeholder'
);

// Server-side administrator client (bypasses RLS policies)
export const supabaseAdmin = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseServiceRoleKey || supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE1MzYwMDAsImV4cCI6MTk4NzExMzYwMH0.placeholder',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

