import { supabase, supabaseAdmin, hasAdminConfig } from './client';
import { Program, Blog, Testimonial, Mentor, Lead, HomepageSettings, ProjectShowcase } from '@/types';

// Generic error handler
const handleError = (error: any) => {
  console.error('Supabase Error:', error);
  throw new Error(error.message || 'Database error occurred');
};

// Use supabaseAdmin (if service role key is set) to bypass Row Level Security (RLS) on server-side database actions
const dbClient = hasAdminConfig ? supabaseAdmin : supabase;

if (hasAdminConfig) {
  console.log('🛡️ DATABASE SERVICE: Using RLS bypass admin client.');
} else {
  console.log('⚠️ DATABASE SERVICE: Using standard client (subject to RLS restrictions).');
}

// ==========================================
// PROGRAMS
// ==========================================
export const programsService = {
  async getAll(): Promise<Program[]> {
    console.log('FETCHING: All programs');
    const { data, error } = await dbClient.from('programs').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  async getById(id: string): Promise<Program | null> {
    console.log(`FETCHING: Program by id = ${id}`);
    const { data, error } = await dbClient.from('programs').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') handleError(error);
    return data || null;
  },
  async getBySlug(slug: string): Promise<Program | null> {
    console.log(`FETCHING: Program by slug = ${slug}`);
    const { data, error } = await dbClient.from('programs').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') handleError(error);
    return data || null;
  },
  async create(program: Partial<Program>): Promise<Program> {
    console.log('CREATING: Program', program.id);
    const { data, error } = await dbClient.from('programs').insert(program).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, program: Partial<Program>): Promise<Program> {
    console.log(`UPDATING: Program id = ${id}`);
    const { data, error } = await dbClient.from('programs').update(program).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    console.log(`DELETING: Program id = ${id}`);
    const { error } = await dbClient.from('programs').delete().eq('id', id);
    if (error) handleError(error);
  }
};

// ==========================================
// LEARNING PATHS
// ==========================================
export const learningPathsService = {
  async getAll(): Promise<any[]> {
    console.log('FETCHING: All learning paths');
    const { data, error } = await dbClient.from('learning_paths').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  async getById(id: string): Promise<any | null> {
    console.log(`FETCHING: Learning path by id = ${id}`);
    const { data, error } = await dbClient.from('learning_paths').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },
  async create(path: Partial<any>): Promise<any> {
    console.log('CREATING: Learning path', path.id);
    const { data, error } = await dbClient.from('learning_paths').insert(path).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, path: Partial<any>): Promise<any> {
    console.log(`UPDATING: Learning path id = ${id}`);
    const { data, error } = await dbClient.from('learning_paths').update(path).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    console.log(`DELETING: Learning path id = ${id}`);
    const { error } = await dbClient.from('learning_paths').delete().eq('id', id);
    if (error) handleError(error);
  }
};

// ==========================================
// BLOGS
// ==========================================
export const blogsService = {
  async getAll(publishedOnly = false): Promise<Blog[]> {
    console.log(`FETCHING: All blogs (publishedOnly = ${publishedOnly})`);
    let query = dbClient.from('blogs').select('*').order('published_at', { ascending: false });
    if (publishedOnly) query = query.eq('is_published', true);
    const { data, error } = await query;
    if (error) handleError(error);
    return data || [];
  },
  async getBySlug(slug: string): Promise<Blog | null> {
    console.log(`FETCHING: Blog by slug = ${slug}`);
    const { data, error } = await dbClient.from('blogs').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') handleError(error);
    return data || null;
  },
  async create(blog: Partial<Blog>): Promise<Blog> {
    console.log('CREATING: Blog', blog.id);
    const { data, error } = await dbClient.from('blogs').insert(blog).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, blog: Partial<Blog>): Promise<Blog> {
    console.log(`UPDATING: Blog id = ${id}`);
    const { data, error } = await dbClient.from('blogs').update(blog).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    console.log(`DELETING: Blog id = ${id}`);
    const { error } = await dbClient.from('blogs').delete().eq('id', id);
    if (error) handleError(error);
  }
};

// ==========================================
// TESTIMONIALS
// ==========================================
export const testimonialsService = {
  async getAll(): Promise<Testimonial[]> {
    console.log('FETCHING: All testimonials');
    const { data, error } = await dbClient.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  async create(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    console.log('CREATING: Testimonial');
    const { data, error } = await dbClient.from('testimonials').insert(testimonial).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    console.log(`UPDATING: Testimonial id = ${id}`);
    const { data, error } = await dbClient.from('testimonials').update(testimonial).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    console.log(`DELETING: Testimonial id = ${id}`);
    const { error } = await dbClient.from('testimonials').delete().eq('id', id);
    if (error) handleError(error);
  }
};

// ==========================================
// MENTORS
// ==========================================
export const mentorsService = {
  async getAll(): Promise<Mentor[]> {
    console.log('FETCHING: All mentors');
    const { data, error } = await dbClient.from('mentors').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  async create(mentor: Partial<Mentor>): Promise<Mentor> {
    console.log('CREATING: Mentor');
    const { data, error } = await dbClient.from('mentors').insert(mentor).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, mentor: Partial<Mentor>): Promise<Mentor> {
    console.log(`UPDATING: Mentor id = ${id}`);
    const { data, error } = await dbClient.from('mentors').update(mentor).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    console.log(`DELETING: Mentor id = ${id}`);
    const { error } = await dbClient.from('mentors').delete().eq('id', id);
    if (error) handleError(error);
  }
};

// ==========================================
// LEADS (CRM)
// ==========================================
export const leadsService = {
  async getAll(): Promise<Lead[]> {
    console.log('FETCHING: All leads');
    const { data, error } = await dbClient.from('leads').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  async create(lead: Partial<Lead>): Promise<Lead> {
    console.log('CREATING: Lead');
    const { data, error } = await dbClient.from('leads').insert(lead).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    console.log(`UPDATING: Lead id = ${id}`);
    const { data, error } = await dbClient.from('leads').update(lead).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    console.log(`DELETING: Lead id = ${id}`);
    const { error } = await dbClient.from('leads').delete().eq('id', id);
    if (error) handleError(error);
  }
};

// ==========================================
// SITE CONFIG
// ==========================================
export const siteConfigService = {
  async get(): Promise<HomepageSettings | null> {
    console.log('FETCHING: Site configuration');
    const { data, error } = await dbClient.from('site_config').select('*').eq('id', 'global').single();
    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },
  async update(config: Partial<HomepageSettings>): Promise<HomepageSettings> {
    console.log('UPDATING: Site configuration');
    const { data, error } = await dbClient.from('site_config').update(config).eq('id', 'global').select().single();
    if (error) handleError(error);
    return data;
  }
};

// ==========================================
// PROJECT SHOWCASE
// ==========================================
export const showcaseService = {
  async getAll(): Promise<ProjectShowcase[]> {
    console.log('FETCHING: All showcase projects');
    const { data, error } = await dbClient.from('showcase').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  async create(project: Partial<ProjectShowcase>): Promise<ProjectShowcase> {
    console.log('CREATING: Showcase project');
    const { data, error } = await dbClient.from('showcase').insert(project).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, project: Partial<ProjectShowcase>): Promise<ProjectShowcase> {
    console.log(`UPDATING: Showcase project id = ${id}`);
    const { data, error } = await dbClient.from('showcase').update(project).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    console.log(`DELETING: Showcase project id = ${id}`);
    const { error } = await dbClient.from('showcase').delete().eq('id', id);
    if (error) handleError(error);
  }
};

// ==========================================
// VISUAL BLOCKS
// ==========================================
export const visualBlocksService = {
  async getAll(): Promise<any[]> {
    console.log('FETCHING: All visual blocks');
    const { data, error } = await dbClient.from('visual_blocks').select('*').order('position', { ascending: true });
    if (error) handleError(error);
    return data || [];
  },
  async saveAll(blocks: any[]): Promise<void> {
    console.log('SYNCHRONIZING: Visual blocks', blocks.length);
    const { error: deleteError } = await dbClient.from('visual_blocks').delete().neq('id', 'placeholder-non-existent');
    if (deleteError) handleError(deleteError);
    if (blocks.length > 0) {
      const { error: insertError } = await dbClient.from('visual_blocks').insert(blocks);
      if (insertError) handleError(insertError);
    }
  }
};
