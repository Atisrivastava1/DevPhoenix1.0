import { slugify } from "@/lib/api-utils";

/**
 * Custom validation error to propagate clear, field-level HTTP 400 messages to the frontend.
 */
export class ValidationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

/**
 * Helper to ensure a string is trimmed and non-empty.
 */
function trimString(val: any, label: string, required = false): string {
  if (val === undefined || val === null) {
    if (required) throw new ValidationError(`${label} is required`);
    return "";
  }
  const str = String(val).trim();
  if (required && str === "") {
    throw new ValidationError(`${label} is required`);
  }
  return str;
}

/**
 * Centralized schema columns mappings and validations to prevent DB schema mismatch failures.
 * Produces clean, validated snake_case properties matching the database columns exactly.
 */
export const sanitizePayload = {
  /**
   * Programs sanitizer
   */
  program(body: any): any {
    const title = trimString(body.title, "Program Title", true);
    const rawSlug = trimString(body.slug || title, "Slug");
    const cleanSlug = slugify(rawSlug);
    if (!cleanSlug) {
      throw new ValidationError("A valid slug or title is required to generate the program identifier");
    }

    const practical_hours = trimString(body.practical_hours || body.practicalHours, "Practical Hours", true);
    const raw_pricing = body.pricing_details || body.pricingDetails || {};
    const pricing_details = {
      original_price: trimString(raw_pricing.original_price || raw_pricing.originalPrice, "Original Price"),
      discounted_price: trimString(raw_pricing.discounted_price || raw_pricing.discountedPrice, "Discounted Price"),
      emi: trimString(raw_pricing.emi, "EMI Option"),
      includes: Array.isArray(raw_pricing.includes) ? raw_pricing.includes : []
    };

    return {
      id: trimString(body.id || cleanSlug, "ID"),
      slug: cleanSlug,
      title,
      description: trimString(body.description, "Description", true),
      overview: trimString(body.overview, "Overview") || null,
      category: trimString(body.category, "Category", true),
      level: trimString(body.level, "Level", true),
      duration: trimString(body.duration, "Duration", true),
      type: trimString(body.type, "Type", true),
      price: trimString(body.price, "Price", true),
      practical_hours,
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      image: trimString(body.image, "Cover Image", true),
      outcomes: Array.isArray(body.outcomes) ? body.outcomes.map((o: any) => String(o).trim()).filter(Boolean) : [],
      projects: typeof body.projects === "number" ? body.projects : Number(body.projects) || 0,
      curriculum: Array.isArray(body.curriculum) ? body.curriculum : [],
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
      pricing_details,
      tools: Array.isArray(body.tools) ? body.tools.map((t: any) => String(t).trim()).filter(Boolean) : [],
      certifications: Array.isArray(body.certifications) ? body.certifications.map((c: any) => String(c).trim()).filter(Boolean) : [],
    };
  },

  /**
   * Blogs sanitizer
   */
  blog(body: any): any {
    const title = trimString(body.title, "Blog Title", true);
    const rawSlug = trimString(body.slug || title, "Slug");
    const cleanSlug = slugify(rawSlug);
    if (!cleanSlug) {
      throw new ValidationError("A valid slug or title is required to generate the article identifier");
    }

    return {
      id: trimString(body.id || cleanSlug, "ID"),
      slug: cleanSlug,
      title,
      excerpt: trimString(body.excerpt, "Excerpt", true),
      content: trimString(body.content, "Content", true),
      cover_image: trimString(body.cover_image || body.coverImage || body.image, "Cover Image", true),
      published_at: trimString(body.published_at || body.publishedAt || body.date, "Published Date", true),
      read_time: trimString(body.read_time || body.readTime, "Read Time", true),
      category: trimString(body.category, "Category", true),
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      author: body.author || { name: "Admin", role: "Instructor", avatar: "" },
      is_published: typeof body.is_published === "boolean" ? body.is_published : (typeof body.isPublished === "boolean" ? body.isPublished : body.published === true || false),
    };
  },

  /**
   * Testimonials sanitizer
   */
  testimonial(body: any): any {
    return {
      id: trimString(body.id || `testi-${Date.now()}`, "ID"),
      name: trimString(body.name, "Name", true),
      role: trimString(body.role, "Role", true),
      company: trimString(body.company, "Company") || null,
      avatar: trimString(body.avatar || body.image, "Avatar Image", true),
      content: trimString(body.content, "Content", true),
      program: trimString(body.program, "Associated Program", true),
      rating: typeof body.rating === "number" ? body.rating : Number(body.rating) || 5,
    };
  },

  /**
   * Mentors sanitizer
   */
  mentor(body: any): any {
    return {
      id: trimString(body.id || `mentor-${Date.now()}`, "ID"),
      name: trimString(body.name, "Name", true),
      role: trimString(body.role, "Role", true),
      status: trimString(body.status, "Status") || "online",
      avatar: trimString(body.avatar || body.image, "Avatar Image", true),
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      is_verified: typeof body.is_verified === "boolean" ? body.is_verified : (typeof body.isVerified === "boolean" ? body.isVerified : true),
      followers: typeof body.followers === "number" ? body.followers : Number(body.followers) || 0,
    };
  },

  /**
   * Leads sanitizer
   */
  lead(body: any): any {
    return {
      id: trimString(body.id || `lead-${Date.now()}`, "ID"),
      name: trimString(body.name, "Name", true),
      email: trimString(body.email, "Email Address", true),
      phone: trimString(body.phone, "Phone Number", true),
      program: trimString(body.program, "Course Interest") || "",
      current_status: trimString(body.current_status || body.currentStatus, "Current Status") || "",
      message: trimString(body.message, "Message") || null,
      source_page: trimString(body.source_page, "Source Page") || "",
      source_campaign: trimString(body.source_campaign, "Source Campaign") || "",
      status: trimString(body.status, "Status") || "New",
      notes: Array.isArray(body.notes) ? body.notes : [],
      assigned_admin: trimString(body.assigned_admin, "Assigned Admin") || null,
      last_contacted_at: body.last_contacted_at || null,
    };
  },

  /**
   * Site Config sanitizer
   */
  siteConfig(body: any): any {
    const result: any = {
      id: trimString(body.id || "global", "ID"),
    };

    if (body.hero) result.hero = body.hero;
    if (body.contact) result.contact = body.contact;
    if (body.socials) result.socials = body.socials;
    if (body.footer) result.footer = body.footer;
    if (body.footerColumns) result.footerColumns = body.footerColumns;
    if (body.navItems) result.navItems = body.navItems;

    return result;
  },

  /**
   * Showcase sanitizer
   */
  showcase(body: any): any {
    return {
      id: trimString(body.id || `show-${Date.now()}`, "ID"),
      title: trimString(body.title, "Project Title", true),
      description: trimString(body.description, "Project Description", true),
      image: trimString(body.image, "Project Screenshot Image", true),
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      github_url: trimString(body.github_url || body.githubUrl, "GitHub URL") || null,
      live_url: trimString(body.live_url || body.liveUrl, "Live Demo URL") || null,
      author_name: trimString(body.author_name || body.authorName, "Student Author Name", true),
      program_name: trimString(body.program_name || body.programName, "Associated Program Name", true),
    };
  },

  /**
   * Visual Blocks sanitizer
   */
  visualBlock(body: any): any {
    return {
      id: trimString(body.id || `vb-${Date.now()}`, "ID"),
      section_key: trimString(body.section_key || body.sectionKey, "Section Key", true),
      title: trimString(body.title, "Visual Title", true),
      subtitle: trimString(body.subtitle, "Subtitle") || null,
      description: trimString(body.description, "Description") || null,
      image_url: trimString(body.image_url || body.imageUrl || body.image, "Image URL") || null,
      image_alt: trimString(body.image_alt || body.imageAlt, "Image Alt Text") || null,
      badge: trimString(body.badge, "Badge Text") || null,
      cta_text: trimString(body.cta_text || body.ctaText, "CTA Button Text") || null,
      cta_link: trimString(body.cta_link || body.ctaLink || body.ctaUrl, "CTA Link URL") || null,
      position: typeof body.position === "number" ? body.position : Number(body.position) || 0,
      visibility: typeof body.visibility === "boolean" ? body.visibility : body.isVisible !== false,
      theme_variant: trimString(body.theme_variant || body.themeVariant, "Theme Variant") || "glass",
    };
  },

  /**
   * Learning Paths sanitizer
   */
  learningPath(body: any): any {
    return {
      id: trimString(body.id || `path-${Date.now()}`, "ID"),
      title: trimString(body.title, "Path Title", true),
      description: trimString(body.description, "Description") || null,
      level: trimString(body.level, "Difficulty Level") || "All Levels",
      duration: trimString(body.duration, "Path Duration") || null,
      image: trimString(body.image, "Path Cover Image") || null,
      included: Array.isArray(body.included) ? body.included.map((x: any) => String(x).trim()).filter(Boolean) : [],
      build: Array.isArray(body.build) ? body.build : [],
      tags: Array.isArray(body.tags) ? body.tags.map((x: any) => String(x).trim()).filter(Boolean) : [],
      modules: Array.isArray(body.modules) ? body.modules : [],
    };
  },

  /**
   * Opportunities sanitizer
   */
  opportunity(body: any): any {
    return {
      id: trimString(body.id || `opp-${Date.now()}`, "ID"),
      title: trimString(body.title, "Deal Title", true),
      client: trimString(body.client, "Client Name", true),
      value: trimString(body.value, "Pipeline Value", true),
      stage: trimString(body.stage, "Stage") || "Discovery",
      closeDate: trimString(body.closeDate || body.close_date, "Close Date") || "",
      probability: trimString(body.probability, "Probability") || "0%",
    };
  },
};
