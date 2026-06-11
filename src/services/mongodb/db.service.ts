import { getDb } from './client';
import {
  Program,
  Blog,
  Testimonial,
  Mentor,
  Lead,
  HomepageSettings,
  ProjectShowcase,
  Opportunity,
} from '@/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const handleError = (error: any) => {
  console.error('MongoDB Error:', error);
  throw new Error(error.message || 'Database error occurred');
};

/** Strip Mongo _id and return a plain JS object */
function stripId<T>(doc: any): T {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest as T;
}

/** Strip _id from an array of documents */
function stripIds<T>(docs: any[]): T[] {
  return docs.map((d) => stripId<T>(d));
}

// ==========================================
// PROGRAMS
// ==========================================
export const programsService = {
  async getAll(): Promise<Program[]> {
    console.log('FETCHING: All programs');
    try {
      const db = await getDb();
      const docs = await db
        .collection('programs')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return stripIds<Program>(docs);
    } catch (e) {
      handleError(e);
      return [];
    }
  },

  async getById(id: string): Promise<Program | null> {
    console.log(`FETCHING: Program by id = ${id}`);
    try {
      const db = await getDb();
      const doc = await db.collection('programs').findOne({ id });
      return doc ? stripId<Program>(doc) : null;
    } catch (e) {
      handleError(e);
      return null;
    }
  },

  async getBySlug(slug: string): Promise<Program | null> {
    console.log(`FETCHING: Program by slug = ${slug}`);
    try {
      const db = await getDb();
      const doc = await db.collection('programs').findOne({ slug });
      return doc ? stripId<Program>(doc) : null;
    } catch (e) {
      handleError(e);
      return null;
    }
  },

  async create(program: Partial<Program>): Promise<Program> {
    console.log('CREATING: Program', program.id);
    try {
      const db = await getDb();
      await db.collection('programs').insertOne({ ...program });
      return program as Program;
    } catch (e) {
      handleError(e);
      return program as Program;
    }
  },

  async update(id: string, program: Partial<Program>): Promise<Program> {
    console.log(`UPDATING: Program id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('programs').updateOne({ id }, { $set: program });
      const updated = await db.collection('programs').findOne({ id });
      return stripId<Program>(updated);
    } catch (e) {
      handleError(e);
      return program as Program;
    }
  },

  async delete(id: string): Promise<void> {
    console.log(`DELETING: Program id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('programs').deleteOne({ id });
    } catch (e) {
      handleError(e);
    }
  },
};

// ==========================================
// LEARNING PATHS
// ==========================================
export const learningPathsService = {
  async getAll(): Promise<any[]> {
    console.log('FETCHING: All learning paths');
    try {
      const db = await getDb();
      const docs = await db
        .collection('learning_paths')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return stripIds(docs);
    } catch (e) {
      handleError(e);
      return [];
    }
  },

  async getById(id: string): Promise<any | null> {
    console.log(`FETCHING: Learning path by id = ${id}`);
    try {
      const db = await getDb();
      const doc = await db.collection('learning_paths').findOne({ id });
      return doc ? stripId(doc) : null;
    } catch (e) {
      handleError(e);
      return null;
    }
  },

  async create(path: Partial<any>): Promise<any> {
    console.log('CREATING: Learning path', path.id);
    try {
      const db = await getDb();
      await db.collection('learning_paths').insertOne({ ...path });
      return path;
    } catch (e) {
      handleError(e);
      return path;
    }
  },

  async update(id: string, path: Partial<any>): Promise<any> {
    console.log(`UPDATING: Learning path id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('learning_paths').updateOne({ id }, { $set: path });
      const updated = await db.collection('learning_paths').findOne({ id });
      return stripId(updated);
    } catch (e) {
      handleError(e);
      return path;
    }
  },

  async delete(id: string): Promise<void> {
    console.log(`DELETING: Learning path id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('learning_paths').deleteOne({ id });
    } catch (e) {
      handleError(e);
    }
  },
};

// ==========================================
// BLOGS
// ==========================================
export const blogsService = {
  async getAll(publishedOnly = false): Promise<Blog[]> {
    console.log(`FETCHING: All blogs (publishedOnly = ${publishedOnly})`);
    try {
      const db = await getDb();
      const filter = publishedOnly ? { is_published: true } : {};
      const docs = await db
        .collection('blogs')
        .find(filter)
        .sort({ published_at: -1 })
        .toArray();
      return stripIds<Blog>(docs);
    } catch (e) {
      handleError(e);
      return [];
    }
  },

  async getBySlug(slug: string): Promise<Blog | null> {
    console.log(`FETCHING: Blog by slug = ${slug}`);
    try {
      const db = await getDb();
      const doc = await db.collection('blogs').findOne({ slug });
      return doc ? stripId<Blog>(doc) : null;
    } catch (e) {
      handleError(e);
      return null;
    }
  },

  async create(blog: Partial<Blog>): Promise<Blog> {
    console.log('CREATING: Blog', blog.id);
    try {
      const db = await getDb();
      await db.collection('blogs').insertOne({ ...blog });
      return blog as Blog;
    } catch (e) {
      handleError(e);
      return blog as Blog;
    }
  },

  async update(id: string, blog: Partial<Blog>): Promise<Blog> {
    console.log(`UPDATING: Blog id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('blogs').updateOne({ id }, { $set: blog });
      const updated = await db.collection('blogs').findOne({ id });
      return stripId<Blog>(updated);
    } catch (e) {
      handleError(e);
      return blog as Blog;
    }
  },

  async delete(id: string): Promise<void> {
    console.log(`DELETING: Blog id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('blogs').deleteOne({ id });
    } catch (e) {
      handleError(e);
    }
  },
};

// ==========================================
// TESTIMONIALS
// ==========================================
export const testimonialsService = {
  async getAll(): Promise<Testimonial[]> {
    console.log('FETCHING: All testimonials');
    try {
      const db = await getDb();
      const docs = await db
        .collection('testimonials')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return stripIds<Testimonial>(docs);
    } catch (e) {
      handleError(e);
      return [];
    }
  },

  async create(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    console.log('CREATING: Testimonial');
    try {
      const db = await getDb();
      await db.collection('testimonials').insertOne({ ...testimonial });
      return testimonial as Testimonial;
    } catch (e) {
      handleError(e);
      return testimonial as Testimonial;
    }
  },

  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    console.log(`UPDATING: Testimonial id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('testimonials').updateOne({ id }, { $set: testimonial });
      const updated = await db.collection('testimonials').findOne({ id });
      return stripId<Testimonial>(updated);
    } catch (e) {
      handleError(e);
      return testimonial as Testimonial;
    }
  },

  async delete(id: string): Promise<void> {
    console.log(`DELETING: Testimonial id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('testimonials').deleteOne({ id });
    } catch (e) {
      handleError(e);
    }
  },
};

// ==========================================
// MENTORS
// ==========================================
export const mentorsService = {
  async getAll(): Promise<Mentor[]> {
    console.log('FETCHING: All mentors');
    try {
      const db = await getDb();
      const docs = await db
        .collection('mentors')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return stripIds<Mentor>(docs);
    } catch (e) {
      handleError(e);
      return [];
    }
  },

  async create(mentor: Partial<Mentor>): Promise<Mentor> {
    console.log('CREATING: Mentor');
    try {
      const db = await getDb();
      await db.collection('mentors').insertOne({ ...mentor });
      return mentor as Mentor;
    } catch (e) {
      handleError(e);
      return mentor as Mentor;
    }
  },

  async update(id: string, mentor: Partial<Mentor>): Promise<Mentor> {
    console.log(`UPDATING: Mentor id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('mentors').updateOne({ id }, { $set: mentor });
      const updated = await db.collection('mentors').findOne({ id });
      return stripId<Mentor>(updated);
    } catch (e) {
      handleError(e);
      return mentor as Mentor;
    }
  },

  async delete(id: string): Promise<void> {
    console.log(`DELETING: Mentor id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('mentors').deleteOne({ id });
    } catch (e) {
      handleError(e);
    }
  },
};

// ==========================================
// LEADS (CRM)
// ==========================================
export const leadsService = {
  async getAll(): Promise<Lead[]> {
    console.log('FETCHING: All leads');
    try {
      const db = await getDb();
      const docs = await db
        .collection('leads')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return stripIds<Lead>(docs);
    } catch (e) {
      handleError(e);
      return [];
    }
  },

  async create(lead: Partial<Lead>): Promise<Lead> {
    console.log('CREATING: Lead');
    try {
      const db = await getDb();
      await db.collection('leads').insertOne({ ...lead });
      return lead as Lead;
    } catch (e) {
      handleError(e);
      return lead as Lead;
    }
  },

  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    console.log(`UPDATING: Lead id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('leads').updateOne({ id }, { $set: lead });
      const updated = await db.collection('leads').findOne({ id });
      return stripId<Lead>(updated);
    } catch (e) {
      handleError(e);
      return lead as Lead;
    }
  },

  async delete(id: string): Promise<void> {
    console.log(`DELETING: Lead id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('leads').deleteOne({ id });
    } catch (e) {
      handleError(e);
    }
  },
};

// ==========================================
// OPPORTUNITIES (CRM)
// ==========================================
export const opportunitiesService = {
  async getAll(): Promise<Opportunity[]> {
    console.log('FETCHING: All opportunities');
    try {
      const db = await getDb();
      const docs = await db
        .collection('opportunities')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return stripIds<Opportunity>(docs);
    } catch (e) {
      handleError(e);
      return [];
    }
  },

  async create(opportunity: Partial<Opportunity>): Promise<Opportunity> {
    console.log('CREATING: Opportunity');
    try {
      const db = await getDb();
      await db.collection('opportunities').insertOne({ ...opportunity });
      return opportunity as Opportunity;
    } catch (e) {
      handleError(e);
      return opportunity as Opportunity;
    }
  },

  async update(id: string, opportunity: Partial<Opportunity>): Promise<Opportunity> {
    console.log(`UPDATING: Opportunity id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('opportunities').updateOne({ id }, { $set: opportunity });
      const updated = await db.collection('opportunities').findOne({ id });
      return stripId<Opportunity>(updated);
    } catch (e) {
      handleError(e);
      return opportunity as Opportunity;
    }
  },

  async delete(id: string): Promise<void> {
    console.log(`DELETING: Opportunity id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('opportunities').deleteOne({ id });
    } catch (e) {
      handleError(e);
    }
  },
};

// ==========================================
// SITE CONFIG
// ==========================================
export const siteConfigService = {
  async get(): Promise<HomepageSettings | null> {
    console.log('FETCHING: Site configuration');
    try {
      const db = await getDb();
      const doc = await db.collection('site_config').findOne({ id: 'global' });
      return doc ? stripId<HomepageSettings>(doc) : null;
    } catch (e) {
      handleError(e);
      return null;
    }
  },

  async update(config: Partial<HomepageSettings>): Promise<HomepageSettings> {
    console.log('UPDATING: Site configuration');
    try {
      const db = await getDb();
      await db
        .collection('site_config')
        .updateOne({ id: 'global' }, { $set: config }, { upsert: true });
      const updated = await db.collection('site_config').findOne({ id: 'global' });
      return stripId<HomepageSettings>(updated);
    } catch (e) {
      handleError(e);
      return config as HomepageSettings;
    }
  },
};

// ==========================================
// PROJECT SHOWCASE
// ==========================================
export const showcaseService = {
  async getAll(): Promise<ProjectShowcase[]> {
    console.log('FETCHING: All showcase projects');
    try {
      const db = await getDb();
      const docs = await db
        .collection('showcase')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return stripIds<ProjectShowcase>(docs);
    } catch (e) {
      handleError(e);
      return [];
    }
  },

  async create(project: Partial<ProjectShowcase>): Promise<ProjectShowcase> {
    console.log('CREATING: Showcase project');
    try {
      const db = await getDb();
      await db.collection('showcase').insertOne({ ...project });
      return project as ProjectShowcase;
    } catch (e) {
      handleError(e);
      return project as ProjectShowcase;
    }
  },

  async update(id: string, project: Partial<ProjectShowcase>): Promise<ProjectShowcase> {
    console.log(`UPDATING: Showcase project id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('showcase').updateOne({ id }, { $set: project });
      const updated = await db.collection('showcase').findOne({ id });
      return stripId<ProjectShowcase>(updated);
    } catch (e) {
      handleError(e);
      return project as ProjectShowcase;
    }
  },

  async delete(id: string): Promise<void> {
    console.log(`DELETING: Showcase project id = ${id}`);
    try {
      const db = await getDb();
      await db.collection('showcase').deleteOne({ id });
    } catch (e) {
      handleError(e);
    }
  },
};

// ==========================================
// VISUAL BLOCKS
// ==========================================
export const visualBlocksService = {
  async getAll(): Promise<any[]> {
    console.log('FETCHING: All visual blocks');
    try {
      const db = await getDb();
      const docs = await db
        .collection('visual_blocks')
        .find({})
        .sort({ position: 1 })
        .toArray();
      return stripIds(docs);
    } catch (e) {
      handleError(e);
      return [];
    }
  },

  async saveAll(blocks: any[]): Promise<void> {
    console.log('SYNCHRONIZING: Visual blocks', blocks.length);
    try {
      const db = await getDb();
      const col = db.collection('visual_blocks');
      // Delete all existing, then insert fresh
      await col.deleteMany({});
      if (blocks.length > 0) {
        await col.insertMany(blocks.map((b) => ({ ...b })));
      }
    } catch (e) {
      handleError(e);
    }
  },
};
