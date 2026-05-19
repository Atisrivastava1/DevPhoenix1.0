import { NextRequest, NextResponse } from "next/server";
import { blogPosts } from "@/data/blog";
import { blogsService } from "@/services/supabase/db.service";
import { hasSupabaseConfig } from "@/services/supabase/client";
import { apiResponse, getLocalCacheHelper } from "@/lib/api-utils";
import { BlogCMS } from "@/types/cms-schema";
import { sanitizePayload } from "@/lib/api/sanitize-payload";

export const dynamic = "force-dynamic";

const INITIAL_SEED: BlogCMS[] = blogPosts.map((post, idx) => ({
  id: `blog-static-${idx}`,
  created_at: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  category: post.category,
  readTime: post.readTime,
  date: post.date,
  image: post.image,
  published: true,
  author: post.author,
}));

const cache = getLocalCacheHelper<BlogCMS>("blog-dynamic.json", undefined, INITIAL_SEED);

export async function GET() {
  if (!hasSupabaseConfig) {
    return apiResponse.success(cache.read());
  }
  try {
    const data = await blogsService.getAll();
    return apiResponse.success(data);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    const sanitized = sanitizePayload.blog(body);
    const newPost: BlogCMS = {
      ...sanitized,
      created_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
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
      return NextResponse.json(
        {
          success: false,
          error: dbErr.message || "Database insert operation failed",
          details: dbErr
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[BLOGS API POST SERVER ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process request",
        details: error
      },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Article ID is required");
    }

    // Sanitize and validate payload
    const sanitized = sanitizePayload.blog(body);
    const updatedPayload = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
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
      return NextResponse.json(
        {
          success: false,
          error: dbErr.message || "Database update operation failed",
          details: dbErr
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[BLOGS API PUT SERVER ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process request",
        details: error
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Article ID is required");
    }

    if (!hasSupabaseConfig) {
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
      return NextResponse.json(
        {
          success: false,
          error: dbErr.message || "Database delete operation failed",
          details: dbErr
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[BLOGS API DELETE SERVER ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process request",
        details: error
      },
      { status: 500 }
    );
  }
}
