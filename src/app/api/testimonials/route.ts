import { NextRequest } from 'next/server';
import { testimonialsService } from '@/services/mongodb/db.service';
import { hasMongoConfig } from '@/services/mongodb/client';
import { apiResponse, getLocalCacheHelper } from '@/lib/api-utils';
import { sanitizePayload, ValidationError } from '@/lib/api/sanitize-payload';
import { Testimonial } from '@/types';

export const dynamic = 'force-dynamic';

const cache = getLocalCacheHelper<Testimonial>('testimonials.json');

export async function GET() {
  if (hasMongoConfig) {
    try {
      const items = await testimonialsService.getAll();
      return apiResponse.success(items);
    } catch (err: any) {
      console.error('Supabase testimonials GET error, falling back to local:', err);
    }
  }
  return apiResponse.success(cache.read());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    let sanitized: Testimonial;
    try {
      sanitized = sanitizePayload.testimonial(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn("⚠️ [POST /api/testimonials] Validation Failed:", valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const newItem: Testimonial = {
      ...sanitized,
      created_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      console.log("[TESTIMONIALS API local cache save]", newItem.id);
      const items = cache.read();
      items.push(newItem);
      cache.write(items);
      return apiResponse.success(newItem, 201);
    }

    console.log("[TESTIMONIALS API POST PAYLOAD]", JSON.stringify(newItem, null, 2));

    try {
      const created = await testimonialsService.create(newItem);
      console.log("[TESTIMONIALS API POST SUCCESS]", JSON.stringify(created, null, 2));
      return apiResponse.success(created, 201);
    } catch (dbErr: any) {
      console.error('[TESTIMONIALS API POST SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database insert operation failed", "DATABASE_INSERT_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[TESTIMONIALS API POST SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Testimonial ID is required", "MISSING_REQUIRED_FIELD");
    }

    // Sanitize and validate payload
    let sanitized: Testimonial;
    try {
      sanitized = sanitizePayload.testimonial(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn(`⚠️ [PUT /api/testimonials] Validation Failed for ${body.id}:`, valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const updatedPayload = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      console.log("[TESTIMONIALS API local cache update]", body.id);
      const items = cache.read();
      const idx = items.findIndex((i) => i.id === body.id);
      if (idx === -1) return apiResponse.notFound("Testimonial not found");
      items[idx] = { ...items[idx], ...updatedPayload };
      cache.write(items);
      return apiResponse.success(items[idx]);
    }

    console.log("[TESTIMONIALS API PUT PAYLOAD]", JSON.stringify(updatedPayload, null, 2));

    try {
      const updated = await testimonialsService.update(body.id, updatedPayload);
      console.log("[TESTIMONIALS API PUT SUCCESS]", JSON.stringify(updated, null, 2));
      return apiResponse.success(updated);
    } catch (dbErr: any) {
      console.error('[TESTIMONIALS API PUT SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database update operation failed", "DATABASE_UPDATE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[TESTIMONIALS API PUT SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Testimonial ID is required", "MISSING_REQUIRED_FIELD");
    }

    console.log("[TESTIMONIALS API DELETE ID]", id);

    if (!hasMongoConfig) {
      const items = cache.read();
      cache.write(items.filter((i) => i.id !== id));
      return apiResponse.success({ success: true });
    }

    try {
      await testimonialsService.delete(id);
      console.log("[TESTIMONIALS API DELETE SUCCESS]");
      return apiResponse.success({ success: true });
    } catch (dbErr: any) {
      console.error('[TESTIMONIALS API DELETE SUPABASE ERROR]', dbErr);
      return apiResponse.error(dbErr.message || "Database delete operation failed", "DATABASE_DELETE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[TESTIMONIALS API DELETE SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}
