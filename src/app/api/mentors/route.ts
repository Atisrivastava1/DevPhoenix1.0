import { NextRequest } from 'next/server';
import { mentorsService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';
import { apiResponse, getLocalCacheHelper } from '@/lib/api-utils';
import { sanitizePayload, ValidationError } from '@/lib/api/sanitize-payload';
import { Mentor } from '@/types';

export const dynamic = 'force-dynamic';

const cache = getLocalCacheHelper<Mentor>('mentors.json');

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const items = await mentorsService.getAll();
      return apiResponse.success(items);
    } catch (err: any) {
      console.error('Supabase mentors GET error, falling back to local:', err);
    }
  }
  return apiResponse.success(cache.read());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    let sanitized: Mentor;
    try {
      sanitized = sanitizePayload.mentor(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn("⚠️ [POST /api/mentors] Validation Failed:", valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const newMentor: Mentor = {
      ...sanitized,
      created_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[MENTORS API local cache save]", newMentor.id);
      const items = cache.read();
      items.push(newMentor);
      cache.write(items);
      return apiResponse.success(newMentor, 201);
    }

    console.log("[MENTORS API POST PAYLOAD]", JSON.stringify(newMentor, null, 2));

    try {
      const created = await mentorsService.create(newMentor);
      console.log("[MENTORS API POST SUCCESS]", JSON.stringify(created, null, 2));
      return apiResponse.success(created, 201);
    } catch (dbErr: any) {
      console.error('[MENTORS API POST SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database insert operation failed", "DATABASE_INSERT_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[MENTORS API POST SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Mentor ID is required", "MISSING_REQUIRED_FIELD");
    }

    // Sanitize and validate payload
    let sanitized: Mentor;
    try {
      sanitized = sanitizePayload.mentor(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn(`⚠️ [PUT /api/mentors] Validation Failed for ${body.id}:`, valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const updatedPayload = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[MENTORS API local cache update]", body.id);
      const items = cache.read();
      const i = items.findIndex((x) => x.id === body.id);
      if (i === -1) return apiResponse.notFound("Mentor not found");
      items[i] = { ...items[i], ...updatedPayload };
      cache.write(items);
      return apiResponse.success(items[i]);
    }

    console.log("[MENTORS API PUT PAYLOAD]", JSON.stringify(updatedPayload, null, 2));

    try {
      const updated = await mentorsService.update(body.id, updatedPayload);
      console.log("[MENTORS API PUT SUCCESS]", JSON.stringify(updated, null, 2));
      return apiResponse.success(updated);
    } catch (dbErr: any) {
      console.error('[MENTORS API PUT SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database update operation failed", "DATABASE_UPDATE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[MENTORS API PUT SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Mentor ID is required", "MISSING_REQUIRED_FIELD");
    }

    console.log("[MENTORS API DELETE ID]", id);

    if (!hasSupabaseConfig) {
      const items = cache.read();
      cache.write(items.filter((x) => x.id !== id));
      return apiResponse.success({ success: true });
    }

    try {
      await mentorsService.delete(id);
      console.log("[MENTORS API DELETE SUCCESS]");
      return apiResponse.success({ success: true });
    } catch (dbErr: any) {
      console.error('[MENTORS API DELETE SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database delete operation failed", "DATABASE_DELETE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[MENTORS API DELETE SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}
