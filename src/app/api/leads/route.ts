import { NextRequest } from "next/server";
import { leadsService } from "@/services/mongodb/db.service";
import { hasMongoConfig } from "@/services/mongodb/client";
import { apiResponse, getLocalCacheHelper } from "@/lib/api-utils";
import { Lead } from "@/types";
import { sanitizePayload, ValidationError } from "@/lib/api/sanitize-payload";

export const dynamic = "force-dynamic";

const cache = getLocalCacheHelper<Lead>("leads.json");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let leads: Lead[] = [];
    if (hasMongoConfig) {
      try {
        leads = await leadsService.getAll();
      } catch (err) {
        console.error("Supabase leads GET error, falling back to local cache:", err);
        leads = cache.read();
      }
    } else {
      leads = cache.read();
    }

    if (status && status !== "All") {
      leads = leads.filter((l) => l.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.program?.toLowerCase().includes(q)
      );
    }

    return apiResponse.success(leads);
  } catch (error: any) {
    return apiResponse.error(error.message, "DATABASE_FETCH_FAILED");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    let sanitized: Lead;
    try {
      sanitized = sanitizePayload.lead(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn("⚠️ [POST /api/leads] Validation Failed:", valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const newLead: Lead = {
      ...sanitized,
      status: "New",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!hasMongoConfig) {
      console.log("[LEADS API local cache save]", newLead.id);
      const list = cache.read();
      list.unshift(newLead);
      cache.write(list);
      return apiResponse.success(newLead, 201);
    }

    console.log("[LEADS API POST PAYLOAD]", JSON.stringify(newLead, null, 2));

    try {
      const result = await leadsService.create(newLead);
      console.log("[LEADS API POST SUCCESS]", JSON.stringify(result, null, 2));
      return apiResponse.success(result, 201);
    } catch (dbErr: any) {
      console.error("[LEADS API POST SUPABASE ERROR]", dbErr);
      return apiResponse.error(dbErr.message || "Database insert operation failed", "DATABASE_INSERT_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[LEADS API POST SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Lead ID is required", "MISSING_REQUIRED_FIELD");
    }

    if (hasMongoConfig) {
      const existingLeads = await leadsService.getAll();
      const found = existingLeads.find((l) => l.id === body.id);
      if (!found) return apiResponse.notFound("Lead not found");

      let updatedPayload: any = {};
      if (body.action === "add_note") {
        const note = {
          id: `note-${Date.now()}`,
          content: body.note,
          created_at: new Date().toISOString(),
          author: body.author || "Admin",
        };
        updatedPayload = {
          notes: [...(found.notes || []), note],
          updated_at: new Date().toISOString(),
        };
      } else {
        // Sanitize other updates to strictly match schema fields
        let sanitized: Lead;
        try {
          sanitized = sanitizePayload.lead(body);
        } catch (valErr: any) {
          if (valErr instanceof ValidationError) {
            return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
          }
          throw valErr;
        }
        updatedPayload = {
          ...sanitized,
          updated_at: new Date().toISOString(),
        };
        delete updatedPayload.id;
      }

      console.log("[LEADS API PUT PAYLOAD]", JSON.stringify(updatedPayload, null, 2));

      try {
        const result = await leadsService.update(body.id, updatedPayload);
        console.log("[LEADS API PUT SUCCESS]", JSON.stringify(result, null, 2));
        return apiResponse.success(result);
      } catch (dbErr: any) {
        console.error("[LEADS API PUT SUPABASE ERROR]", dbErr);
        return apiResponse.error(dbErr.message || "Database update operation failed", "DATABASE_UPDATE_FAILED", dbErr);
      }
    }

    // Local Cache Fallback
    console.log("[LEADS API local cache update]", body.id);
    const list = cache.read();
    const idx = list.findIndex((l) => l.id === body.id);
    if (idx === -1) return apiResponse.notFound("Lead not found");

    if (body.action === "add_note") {
      const note = {
        id: `note-${Date.now()}`,
        content: body.note,
        created_at: new Date().toISOString(),
        author: body.author || "Admin",
      };
      list[idx].notes = [...(list[idx].notes || []), note];
      list[idx].updated_at = new Date().toISOString();
    } else {
      let sanitized: Lead;
      try {
        sanitized = sanitizePayload.lead(body);
      } catch (valErr: any) {
        if (valErr instanceof ValidationError) {
          return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
        }
        throw valErr;
      }
      list[idx] = {
        ...list[idx],
        ...sanitized,
        notes: list[idx].notes,
        updated_at: new Date().toISOString(),
      };
    }

    cache.write(list);
    return apiResponse.success(list[idx]);
  } catch (error: any) {
    console.error("[LEADS API PUT SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Lead ID is required", "MISSING_REQUIRED_FIELD");
    }

    console.log(`[LEADS API DELETE ID]`, id);

    if (!hasMongoConfig) {
      const list = cache.read();
      cache.write(list.filter((l) => l.id !== id));
      return apiResponse.success({ success: true });
    }

    try {
      await leadsService.delete(id);
      console.log("[LEADS API DELETE SUCCESS]");
      return apiResponse.success({ success: true });
    } catch (dbErr: any) {
      console.error("[LEADS API DELETE SUPABASE ERROR]", dbErr);
      return apiResponse.error(dbErr.message || "Database delete operation failed", "DATABASE_DELETE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[LEADS API DELETE SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}
