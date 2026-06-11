import { NextRequest } from 'next/server';
import { learningPathsService } from '@/services/mongodb/db.service';
import { hasMongoConfig } from '@/services/mongodb/client';
import { learningPathsData } from '@/data/learningPaths';
import { apiResponse, getLocalCacheHelper } from '@/lib/api-utils';
import { sanitizePayload, ValidationError } from '@/lib/api/sanitize-payload';

export const dynamic = 'force-dynamic';

const initialSeedData = learningPathsData.map(p => ({
  ...p,
  build: p.build.map(b => ({ text: b.text, icon: '' }))
}));

const cache = getLocalCacheHelper<any>('learningPaths-dynamic.json', undefined, initialSeedData);

export async function GET() {
  console.log('GET /api/learning-paths invoked');
  if (!hasMongoConfig) {
    return apiResponse.success(cache.read());
  }

  try {
    let items = await learningPathsService.getAll();
    if (!items || items.length === 0) {
      console.log('Database empty. Seeding learning paths to Supabase...');
      for (const item of initialSeedData) {
        await learningPathsService.create(item);
      }
      items = await learningPathsService.getAll();
    }
    return apiResponse.success(items);
  } catch (error: any) {
    console.error('Error fetching learning paths from Supabase:', error);
    return apiResponse.success(cache.read());
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    let sanitized: any;
    try {
      sanitized = sanitizePayload.learningPath(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn("⚠️ [POST /api/learning-paths] Validation Failed:", valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const newPath = {
      ...sanitized,
      created_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      console.log("[LEARNING PATHS API local cache save]", newPath.id);
      const paths = cache.read();
      paths.push(newPath);
      cache.write(paths);
      return apiResponse.success(newPath, 201);
    }

    console.log('[LEARNING PATHS API POST PAYLOAD]', JSON.stringify(newPath, null, 2));

    try {
      const created = await learningPathsService.create(newPath);
      console.log("[LEARNING PATHS API POST SUCCESS]", JSON.stringify(created, null, 2));
      return apiResponse.success(created, 201);
    } catch (dbErr: any) {
      console.error('[LEARNING PATHS API POST SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database insert operation failed", "DATABASE_INSERT_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[LEARNING PATHS API POST SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Learning path ID is required", "MISSING_REQUIRED_FIELD");
    }

    // Sanitize and validate payload
    let sanitized: any;
    try {
      sanitized = sanitizePayload.learningPath(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn(`⚠️ [PUT /api/learning-paths] Validation Failed for ${body.id}:`, valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const updatedPayload = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      console.log("[LEARNING PATHS API local cache update]", body.id);
      const paths = cache.read();
      const idx = paths.findIndex((p) => p.id === body.id);
      if (idx === -1) return apiResponse.notFound("Learning path not found");
      paths[idx] = { ...paths[idx], ...updatedPayload };
      cache.write(paths);
      return apiResponse.success(paths[idx]);
    }

    console.log('[LEARNING PATHS API PUT PAYLOAD]', JSON.stringify(updatedPayload, null, 2));

    try {
      const updated = await learningPathsService.update(body.id, updatedPayload);
      console.log("[LEARNING PATHS API PUT SUCCESS]", JSON.stringify(updated, null, 2));
      return apiResponse.success(updated);
    } catch (dbErr: any) {
      console.error('[LEARNING PATHS API PUT SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database update operation failed", "DATABASE_UPDATE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[LEARNING PATHS API PUT SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Learning path ID is required", "MISSING_REQUIRED_FIELD");
    }

    console.log(`[LEARNING PATHS API DELETE ID]`, id);

    if (!hasMongoConfig) {
      const paths = cache.read();
      cache.write(paths.filter((p) => p.id !== id));
      return apiResponse.success({ success: true });
    }

    try {
      await learningPathsService.delete(id);
      console.log("[LEARNING PATHS API DELETE SUCCESS]");
      return apiResponse.success({ success: true });
    } catch (dbErr: any) {
      console.error('[LEARNING PATHS API DELETE SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database delete operation failed", "DATABASE_DELETE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[LEARNING PATHS API DELETE SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}
