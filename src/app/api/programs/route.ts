import { NextRequest } from "next/server";
import { programsService } from "@/services/mongodb/db.service";
import { hasMongoConfig } from "@/services/mongodb/client";
import { apiResponse, getLocalCacheHelper } from "@/lib/api-utils";
import { sanitizePayload, ValidationError } from "@/lib/api/sanitize-payload";
import { Program } from "@/types";

export const dynamic = "force-dynamic";

const cache = getLocalCacheHelper<Program>("programs-dynamic.json", "programs-static.json");

export async function GET() {
  if (!hasMongoConfig) {
    return apiResponse.success(cache.read());
  }
  try {
    const data = await programsService.getAll();
    return apiResponse.success(data);
  } catch (error: any) {
    return apiResponse.error(error.message, "DATABASE_FETCH_FAILED");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate and sanitize payload to snake_case directly
    let program: Program;
    try {
      program = sanitizePayload.program(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn("⚠️ [POST /api/programs] Validation Failed:", valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const newProgram: Program = {
      ...program,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      console.log("ℹ️ [POST /api/programs] Saving to local cache:", newProgram.id);
      const list = cache.read();
      list.push(newProgram);
      cache.write(list);
      return apiResponse.success(newProgram, 201);
    }

    console.log("🚀 [POST /api/programs] Inserting to Supabase. Outgoing Payload:", JSON.stringify(newProgram, null, 2));

    try {
      const result = await programsService.create(newProgram);
      console.log("✅ [POST /api/programs] Supabase Insert Success:", JSON.stringify(result, null, 2));
      return apiResponse.success(result, 201);
    } catch (dbErr: any) {
      console.error("❌ [POST /api/programs] Supabase Database Error:", dbErr);
      return apiResponse.error(dbErr.message || "Database insert operation failed", "DATABASE_INSERT_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("❌ [POST /api/programs] Server Error:", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Program ID is required", "MISSING_REQUIRED_FIELD");
    }

    // Validate and sanitize payload
    let program: Program;
    try {
      program = sanitizePayload.program(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn(`⚠️ [PUT /api/programs] Validation Failed for ${body.id}:`, valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const updatedPayload = {
      ...program,
      updated_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      console.log("ℹ️ [PUT /api/programs] Updating local cache:", body.id);
      const list = cache.read();
      const idx = list.findIndex((p) => p.id === body.id);
      if (idx === -1) return apiResponse.notFound("Program not found");
      list[idx] = { ...list[idx], ...updatedPayload };
      cache.write(list);
      return apiResponse.success(list[idx]);
    }

    console.log(`🚀 [PUT /api/programs] Updating Supabase for ${body.id}. Outgoing Payload:`, JSON.stringify(updatedPayload, null, 2));

    try {
      const result = await programsService.update(body.id, updatedPayload);
      console.log("✅ [PUT /api/programs] Supabase Update Success:", JSON.stringify(result, null, 2));
      return apiResponse.success(result);
    } catch (dbErr: any) {
      console.error("❌ [PUT /api/programs] Supabase Database Error:", dbErr);
      return apiResponse.error(dbErr.message || "Database update operation failed", "DATABASE_UPDATE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("❌ [PUT /api/programs] Server Error:", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Program ID is required", "MISSING_REQUIRED_FIELD");
    }

    if (!hasMongoConfig) {
      const list = cache.read();
      cache.write(list.filter((p) => p.id !== id));
      return apiResponse.success({ success: true });
    }

    await programsService.delete(id);
    return apiResponse.success({ success: true });
  } catch (error: any) {
    return apiResponse.error(error.message, "DATABASE_DELETE_FAILED");
  }
}
