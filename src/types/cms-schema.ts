export interface BaseCMSItem {
  id: string;
  created_at: string;
  updated_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface ProgramCMS extends BaseCMSItem {
  title: string;
  slug: string;
  type: "Premium" | "Industrial";
  category: string;
  level: string;
  duration: string;
  price: string;
  outcomes: string[];
  tags: string[];
  image: string;
  practical_hours: string;
  projects: number;
  curriculum: Array<{
    week: string;
    title: string;
    topics: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  pricing_details?: {
    original_price?: string;
    discounted_price?: string;
    emi?: string;
    includes?: string[];
  };
}

export interface BlogCMS extends BaseCMSItem {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML string
  category: string;
  read_time: string;
  published_at: string;
  cover_image: string;
  is_published: boolean;
  author?: {
    name: string;
    role: string;
    avatar: string;
  };
}

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Consultation Scheduled" | "Converted" | "Closed" | "Lost";

export interface LeadCMS extends BaseCMSItem {
  name: string;
  email: string;
  phone: string;
  program: string;
  status: LeadStatus;
  source_page?: string;
  message?: string;
  current_status?: string;
  notes?: Array<{
    id: string;
    content: string;
    author?: string;
    created_at: string;
  }>;
}
