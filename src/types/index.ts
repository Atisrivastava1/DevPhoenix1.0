// src/types/index.ts

export type ProgramType = 'Premium' | 'Industrial';
export type ProgramLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner to Advanced';

export interface ProgramModule {
  week?: string;          // e.g. "Week 1-2" (from JSON)
  title: string;
  topics?: string[];      // from JSON
  lessons?: string[];     // legacy / Supabase
  duration?: string;
  tools?: string[];
  outcomes?: string[];
}

export interface ProgramFAQ {
  question: string;
  answer: string;
}

export interface ProgramPricing {
  amount?: string;
  currency?: string;
  period?: string;
  discountMessage?: string;
  // Fields from enriched JSON
  original_price?: string;
  originalPrice?: string;
  discounted_price?: string;
  discountedPrice?: string;
  emi?: string | null;
  includes?: string[];
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  description: string;
  overview?: string;
  category: string;
  level: string;           // relaxed from union to support any string from DB
  duration: string;
  type: string;            // relaxed from union
  price: string;
  practical_hours: string;
  practicalHours?: string;
  tags: string[];
  image: string;
  outcomes: string[];
  projects: number;

  // Rich content
  curriculum?: ProgramModule[];
  faqs?: ProgramFAQ[];
  pricing_details?: ProgramPricing;
  pricingDetails?: ProgramPricing;
  tools?: string[];
  certifications?: string[];

  created_at?: string;
  updated_at?: string;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published_at: string;
  read_time: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  content: string;
  program: string;
  rating: number;
  created_at?: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  avatar: string;
  tags: string[];
  is_verified: boolean;
  followers: number;
  created_at?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Consultation Scheduled' | 'Converted' | 'Closed' | 'Lost';

export interface LeadNote {
  id: string;
  content: string;
  created_at: string;
  author?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  college?: string;
  current_status?: string; // Student, Working Professional, etc.
  currentStatus?: string;
  message?: string;
  source_page?: string;
  source_campaign?: string;
  status: LeadStatus;
  notes?: LeadNote[];
  assigned_admin?: string;
  last_contacted_at?: string;
  created_at: string;
  updated_at?: string;
}

export type OpportunityStage = 'Discovery' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Opportunity {
  id: string;
  title: string;
  client: string;
  value: string;
  stage: OpportunityStage;
  closeDate: string;
  probability: string;
  created_at?: string;
  updated_at?: string;
}

export interface HomepageSettings {
  id: string; // Singleton, e.g., 'global'
  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    subheadline: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
    stats: { value: string; label: string }[];
  };
  contact: { email: string; phone: string };
  socials: Record<string, string>;
  updated_at?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  folder: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'editor' | 'content_manager';
  created_at: string;
  last_login?: string;
}

export interface ProjectShowcase {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github_url?: string;
  githubUrl?: string;
  live_url?: string;
  liveUrl?: string;
  author_name?: string;
  authorName?: string;
  student?: string;
  program_name?: string;
  programName?: string;
  category?: string;
  created_at?: string;
}
