import { NextRequest } from "next/server";
import { programsService } from "@/services/supabase/db.service";
import { hasSupabaseConfig } from "@/services/supabase/client";
import { apiResponse, getLocalCacheHelper, slugify } from "@/lib/api-utils";
import { ProgramCMS } from "@/types/cms-schema";

export const dynamic = "force-dynamic";

const cache = getLocalCacheHelper<ProgramCMS>("programs-dynamic.json", "programs-static.json");

export async function GET() {
  if (!hasSupabaseConfig) {
    return apiResponse.success(cache.read());
  }
  try {
    const data = await programsService.getAll();
    return apiResponse.success(data);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

// Strict payload validation & mapping to exact DB columns to prevent NOT NULL and extra-field constraint errors
function validateAndMapProgram(body: any): { program: any; error?: string } {
  const rawTitle = body.title?.trim();
  if (!rawTitle) {
    return { program: null, error: "Program title is required" };
  }

  // Auto-generate slug safely if empty
  const rawSlug = body.slug?.trim() || rawTitle;
  const cleanSlug = slugify(rawSlug);
  if (!cleanSlug) {
    return { program: null, error: "A valid slug or title is required to generate the program identifier" };
  }

  // Validate all required schema fields (marked NOT NULL in Supabase)
  const requiredFields = [
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "level", label: "Level" },
    { key: "duration", label: "Duration" },
    { key: "type", label: "Type" },
    { key: "price", label: "Price" },
    { key: "practicalHours", label: "Practical Hours" },
    { key: "image", label: "Cover Image" }
  ];

  for (const field of requiredFields) {
    const val = body[field.key];
    if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
      return { program: null, error: `${field.label} is required` };
    }
  }

  // Exclude flat contaminated properties like originalPrice, discountedPrice, emi, includes from top-level insert
  const program: any = {
    id: body.id || cleanSlug,
    slug: cleanSlug,
    title: rawTitle,
    description: body.description.trim(),
    overview: body.overview?.trim() || null,
    category: body.category.trim(),
    level: body.level.trim(),
    duration: body.duration.trim(),
    type: body.type.trim(),
    price: body.price.trim(),
    practicalHours: body.practicalHours.trim(),
    tags: Array.isArray(body.tags) ? body.tags : [],
    image: body.image.trim(),
    outcomes: Array.isArray(body.outcomes) ? body.outcomes : [],
    projects: typeof body.projects === "number" ? body.projects : Number(body.projects) || 0,
    curriculum: Array.isArray(body.curriculum) ? body.curriculum : [],
    faqs: Array.isArray(body.faqs) ? body.faqs : [],
    pricingDetails: body.pricingDetails || {},
    tools: Array.isArray(body.tools) ? body.tools : [],
    certifications: Array.isArray(body.certifications) ? body.certifications : [],
  };

  return { program };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate and sanitize payload
    const { program, error } = validateAndMapProgram(body);
    if (error) {
      console.warn("⚠️ [POST /api/programs] Validation Failed:", error);
      return apiResponse.badRequest(error);
    }

    const newProgram: ProgramCMS = {
      ...program,
      created_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
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
      return apiResponse.error(dbErr.message || "Database insert operation failed", 500);
    }
  } catch (error: any) {
    console.error("❌ [POST /api/programs] Server Error:", error);
    return apiResponse.error(error.message || "Failed to process request", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Program ID is required");
    }

    // Validate and sanitize payload
    const { program, error } = validateAndMapProgram(body);
    if (error) {
      console.warn(`⚠️ [PUT /api/programs] Validation Failed for ${body.id}:`, error);
      return apiResponse.badRequest(error);
    }

    const updatedPayload = {
      ...program,
      updated_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
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
      return apiResponse.error(dbErr.message || "Database update operation failed", 500);
    }
  } catch (error: any) {
    console.error("❌ [PUT /api/programs] Server Error:", error);
    return apiResponse.error(error.message || "Failed to process request", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Program ID is required");
    }

    if (!hasSupabaseConfig) {
      const list = cache.read();
      cache.write(list.filter((p) => p.id !== id));
      return apiResponse.success({ success: true });
    }

    await programsService.delete(id);
    return apiResponse.success({ success: true });
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}
