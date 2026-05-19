import { NextRequest } from 'next/server';
import { showcaseProjectsData } from '@/data/showcase';
import { showcaseService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';
import { apiResponse, getLocalCacheHelper } from '@/lib/api-utils';
import { sanitizePayload, ValidationError } from '@/lib/api/sanitize-payload';
import { ProjectShowcase } from '@/types';

export const dynamic = 'force-dynamic';

const INITIAL_SEED: ProjectShowcase[] = showcaseProjectsData.map((project: any, idx) => ({
  id: `showcase-static-${project.id || idx}`,
  title: project.title,
  description: project.description,
  image: project.image,
  tags: project.tags || project.tools || [],
  github_url: project.githubUrl || project.github_url || "https://github.com",
  live_url: project.liveUrl || project.live_url || "https://devphoenix.in",
  author_name: project.authorName || project.author_name || "Alumni Builder",
  program_name: project.programName || project.program_name || project.category || "Full Stack",
  created_at: new Date().toISOString()
}));

const cache = getLocalCacheHelper<ProjectShowcase>('showcase-dynamic.json', undefined, INITIAL_SEED);

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const items = await showcaseService.getAll();
      return apiResponse.success(items);
    } catch (err: any) {
      console.error('Supabase showcase GET error, falling back to local:', err);
    }
  }
  return apiResponse.success(cache.read());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    let sanitized: ProjectShowcase;
    try {
      sanitized = sanitizePayload.showcase(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn("⚠️ [POST /api/showcase] Validation Failed:", valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const newProject: ProjectShowcase = {
      ...sanitized,
      created_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[SHOWCASE API local cache save]", newProject.id);
      const items = cache.read();
      items.push(newProject);
      cache.write(items);
      return apiResponse.success(newProject, 201);
    }

    console.log("[SHOWCASE API POST PAYLOAD]", JSON.stringify(newProject, null, 2));

    try {
      const created = await showcaseService.create(newProject);
      console.log("[SHOWCASE API POST SUCCESS]", JSON.stringify(created, null, 2));
      return apiResponse.success(created, 201);
    } catch (dbErr: any) {
      console.error('[SHOWCASE API POST SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database insert operation failed", "DATABASE_INSERT_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[SHOWCASE API POST SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Project ID is required", "MISSING_REQUIRED_FIELD");
    }

    // Sanitize and validate payload
    let sanitized: ProjectShowcase;
    try {
      sanitized = sanitizePayload.showcase(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn(`⚠️ [PUT /api/showcase] Validation Failed for ${body.id}:`, valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const updatedPayload = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[SHOWCASE API local cache update]", body.id);
      const items = cache.read();
      const i = items.findIndex((x) => x.id === body.id);
      if (i === -1) return apiResponse.notFound("Project not found");
      items[i] = { ...items[i], ...updatedPayload };
      cache.write(items);
      return apiResponse.success(items[i]);
    }

    console.log("[SHOWCASE API PUT PAYLOAD]", JSON.stringify(updatedPayload, null, 2));

    try {
      const updated = await showcaseService.update(body.id, updatedPayload);
      console.log("[SHOWCASE API PUT SUCCESS]", JSON.stringify(updated, null, 2));
      return apiResponse.success(updated);
    } catch (dbErr: any) {
      console.error('[SHOWCASE API PUT SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database update operation failed", "DATABASE_UPDATE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[SHOWCASE API PUT SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Project ID is required", "MISSING_REQUIRED_FIELD");
    }

    console.log("[SHOWCASE API DELETE ID]", id);

    if (!hasSupabaseConfig) {
      const items = cache.read();
      cache.write(items.filter((x) => x.id !== id));
      return apiResponse.success({ success: true });
    }

    try {
      await showcaseService.delete(id);
      console.log("[SHOWCASE API DELETE SUCCESS]");
      return apiResponse.success({ success: true });
    } catch (dbErr: any) {
      console.error('[SHOWCASE API DELETE SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database delete operation failed", "DATABASE_DELETE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[SHOWCASE API DELETE SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}
