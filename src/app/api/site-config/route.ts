import { NextRequest } from 'next/server';
import { siteConfigService } from '@/services/mongodb/db.service';
import { hasMongoConfig } from '@/services/mongodb/client';
import { apiResponse, getLocalCacheHelper } from '@/lib/api-utils';
import { sanitizePayload, ValidationError } from '@/lib/api/sanitize-payload';

export const dynamic = 'force-dynamic';

const cache = getLocalCacheHelper<any>('site-config.json', undefined, {} as any);

export async function GET() {
  if (hasMongoConfig) {
    try {
      const config = await siteConfigService.get();
      if (config) return apiResponse.success(config);
    } catch (err: any) {
      console.error('Supabase site-config GET error, falling back to local:', err);
    }
  }
  return apiResponse.success(cache.read());
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    let sanitized: any;
    try {
      sanitized = sanitizePayload.siteConfig(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn("⚠️ [PUT /api/site-config] Validation Failed:", valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    if (hasMongoConfig) {
      console.log("[SITE CONFIG API PUT PAYLOAD]", JSON.stringify(sanitized, null, 2));
      try {
        const updatedConfig = await siteConfigService.update(sanitized);
        console.log("[SITE CONFIG API PUT SUCCESS]", JSON.stringify(updatedConfig, null, 2));
        return apiResponse.success(updatedConfig);
      } catch (dbErr: any) {
        console.error('[SITE CONFIG API PUT SUPABASE ERROR]', dbErr);
        return apiResponse.error(dbErr.message || "Database update failed", "DATABASE_UPDATE_FAILED", dbErr);
      }
    }

    console.log("[SITE CONFIG API local cache save]");
    const current = cache.read();
    const updated = { ...current, ...sanitized };
    cache.write(updated);
    return apiResponse.success(updated);
  } catch (error: any) {
    console.error("[SITE CONFIG API PUT SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}
