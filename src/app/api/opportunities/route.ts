import { NextRequest } from "next/server";
import { opportunitiesService } from "@/services/mongodb/db.service";
import { hasMongoConfig } from "@/services/mongodb/client";
import { apiResponse, getLocalCacheHelper } from "@/lib/api-utils";
import { sanitizePayload, ValidationError } from "@/lib/api/sanitize-payload";
import { Opportunity } from "@/types";

export const dynamic = "force-dynamic";

const cache = getLocalCacheHelper<Opportunity>("opportunities-dynamic.json", "opportunities-static.json", []);

export async function GET() {
  if (!hasMongoConfig) {
    return apiResponse.success(cache.read());
  }
  try {
    const data = await opportunitiesService.getAll();
    return apiResponse.success(data);
  } catch (error: any) {
    return apiResponse.error(error.message, "DATABASE_FETCH_FAILED");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let opportunity: Opportunity;
    try {
      opportunity = sanitizePayload.opportunity(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const newOpportunity: Opportunity = {
      ...opportunity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      const list = cache.read();
      list.push(newOpportunity);
      cache.write(list);
      return apiResponse.success(newOpportunity, 201);
    }

    try {
      const result = await opportunitiesService.create(newOpportunity);
      return apiResponse.success(result, 201);
    } catch (dbErr: any) {
      return apiResponse.error(dbErr.message || "Database insert failed", "DATABASE_INSERT_FAILED", dbErr);
    }
  } catch (error: any) {
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Opportunity ID is required", "MISSING_REQUIRED_FIELD");
    }

    let opportunity: Opportunity;
    try {
      opportunity = sanitizePayload.opportunity(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const updatedPayload = {
      ...opportunity,
      updated_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      const list = cache.read();
      const idx = list.findIndex((o) => o.id === body.id);
      if (idx === -1) return apiResponse.notFound("Opportunity not found");
      list[idx] = { ...list[idx], ...updatedPayload };
      cache.write(list);
      return apiResponse.success(list[idx]);
    }

    try {
      const result = await opportunitiesService.update(body.id, updatedPayload);
      return apiResponse.success(result);
    } catch (dbErr: any) {
      return apiResponse.error(dbErr.message || "Database update failed", "DATABASE_UPDATE_FAILED", dbErr);
    }
  } catch (error: any) {
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Opportunity ID is required", "MISSING_REQUIRED_FIELD");
    }

    if (!hasMongoConfig) {
      const list = cache.read();
      cache.write(list.filter((o) => o.id !== id));
      return apiResponse.success({ success: true });
    }

    await opportunitiesService.delete(id);
    return apiResponse.success({ success: true });
  } catch (error: any) {
    return apiResponse.error(error.message, "DATABASE_DELETE_FAILED");
  }
}
