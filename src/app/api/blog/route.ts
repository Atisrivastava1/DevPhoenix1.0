import { NextRequest } from "next/server";
import { blogPosts } from "@/data/blog";
import { blogsService } from "@/services/mongodb/db.service";
import { hasMongoConfig } from "@/services/mongodb/client";
import { apiResponse, getLocalCacheHelper } from "@/lib/api-utils";
import { Blog } from "@/types";
import { sanitizePayload, ValidationError } from "@/lib/api/sanitize-payload";

export const dynamic = "force-dynamic";

const INITIAL_SEED: Blog[] = blogPosts.map((post, idx) => ({
  id: `blog-static-${idx}`,
  created_at: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  category: post.category,
  tags: (post as any).tags || [],
  read_time: post.readTime || "5 min read",
  published_at: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
  cover_image: post.image,
  is_published: true,
  author: post.author,
}));

const cache = getLocalCacheHelper<Blog>("blog-dynamic.json", undefined, INITIAL_SEED);

export async function GET() {
  if (!hasMongoConfig) {
    return apiResponse.success(cache.read());
  }
  try {
    const data = await blogsService.getAll();
    return apiResponse.success(data);
  } catch (error: any) {
    return apiResponse.error(error.message, "DATABASE_FETCH_FAILED");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    let sanitized: Blog;
    try {
      sanitized = sanitizePayload.blog(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn("⚠️ [POST /api/blog] Validation Failed:", valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const newPost: Blog = {
      ...sanitized,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      console.log("[BLOGS API local cache save]", newPost.id);
      const list = cache.read();
      list.unshift(newPost);
      cache.write(list);
      return apiResponse.success(newPost, 201);
    }

    console.log("[BLOGS API POST PAYLOAD]", JSON.stringify(newPost, null, 2));

    try {
      const result = await blogsService.create(newPost);
      console.log("[BLOGS API POST SUCCESS]", JSON.stringify(result, null, 2));
      return apiResponse.success(result, 201);
    } catch (dbErr: any) {
      console.error("[BLOGS API POST SUPABASE ERROR]", dbErr);
      return apiResponse.error(dbErr.message || "Database insert operation failed", "DATABASE_INSERT_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[BLOGS API POST SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Article ID is required", "MISSING_REQUIRED_FIELD");
    }

    // Sanitize and validate payload
    let sanitized: Blog;
    try {
      sanitized = sanitizePayload.blog(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn(`⚠️ [PUT /api/blog] Validation Failed for ${body.id}:`, valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const updatedPayload = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      console.log("[BLOGS API local cache update]", body.id);
      const list = cache.read();
      const idx = list.findIndex((p) => p.id === body.id);
      if (idx === -1) return apiResponse.notFound("Article not found");
      list[idx] = { ...list[idx], ...updatedPayload };
      cache.write(list);
      return apiResponse.success(list[idx]);
    }

    console.log("[BLOGS API PUT PAYLOAD]", JSON.stringify(updatedPayload, null, 2));

    try {
      const result = await blogsService.update(body.id, updatedPayload);
      console.log("[BLOGS API PUT SUCCESS]", JSON.stringify(result, null, 2));
      return apiResponse.success(result);
    } catch (dbErr: any) {
      console.error("[BLOGS API PUT SUPABASE ERROR]", dbErr);
      return apiResponse.error(dbErr.message || "Database update operation failed", "DATABASE_UPDATE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[BLOGS API PUT SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Article ID is required", "MISSING_REQUIRED_FIELD");
    }

    if (!hasMongoConfig) {
      const list = cache.read();
      cache.write(list.filter((p) => p.id !== id));
      return apiResponse.success({ success: true });
    }

    console.log("[BLOGS API DELETE ID]", id);

    try {
      await blogsService.delete(id);
      console.log("[BLOGS API DELETE SUCCESS]");
      return apiResponse.success({ success: true });
    } catch (dbErr: any) {
      console.error("[BLOGS API DELETE SUPABASE ERROR]", dbErr);
      return apiResponse.error(dbErr.message || "Database delete operation failed", "DATABASE_DELETE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[BLOGS API DELETE SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}
