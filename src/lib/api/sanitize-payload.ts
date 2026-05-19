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
      practicalHours: trimString(body.practicalHours, "Practical Hours", true),
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      image: trimString(body.image, "Cover Image", true),
      outcomes: Array.isArray(body.outcomes) ? body.outcomes.map((o: any) => String(o).trim()).filter(Boolean) : [],
      projects: typeof body.projects === "number" ? body.projects : Number(body.projects) || 0,
      curriculum: Array.isArray(body.curriculum) ? body.curriculum : [],
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
      pricingDetails: body.pricingDetails || {},
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
      coverImage: trimString(body.coverImage || body.image, "Cover Image", true),
      publishedAt: trimString(body.publishedAt || body.date, "Published Date", true),
      readTime: trimString(body.readTime, "Read Time", true),
      category: trimString(body.category, "Category", true),
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      author: body.author || { name: "Admin", role: "Instructor", avatar: "" },
      isPublished: typeof body.isPublished === "boolean" ? body.isPublished : body.published === true || false,
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
      isVerified: typeof body.isVerified === "boolean" ? body.isVerified : true,
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
      currentStatus: trimString(body.currentStatus, "Current Status") || "",
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
    if (!body.hero || typeof body.hero !== "object") {
      throw new ValidationError("Hero settings are required and must be an object");
    }
    if (!body.contact || typeof body.contact !== "object") {
      throw new ValidationError("Contact info settings are required and must be an object");
    }
    if (!body.socials || typeof body.socials !== "object") {
      throw new ValidationError("Social links settings are required and must be an object");
    }

    return {
      id: trimString(body.id || "global", "ID"),
      hero: body.hero,
      contact: body.contact,
      socials: body.socials,
    };
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
      githubUrl: trimString(body.githubUrl, "GitHub URL") || null,
      liveUrl: trimString(body.liveUrl, "Live Demo URL") || null,
      authorName: trimString(body.authorName, "Student Author Name", true),
      programName: trimString(body.programName, "Associated Program Name", true),
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
};
