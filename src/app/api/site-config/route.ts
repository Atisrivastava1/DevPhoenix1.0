import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { siteConfigService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';
import { sanitizePayload } from '@/lib/api/sanitize-payload';

export const dynamic = 'force-dynamic';

const FILE_PATH = join(process.cwd(), 'src/data/site-config.json');

function read() {
  try { return JSON.parse(readFileSync(FILE_PATH, 'utf-8')); }
  catch { return {}; }
}

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const config = await siteConfigService.get();
      if (config) return NextResponse.json(config);
    } catch (err: any) {
      console.error('Supabase site-config GET error, falling back to local:', err);
    }
  }
  return NextResponse.json(read());
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    const sanitized = sanitizePayload.siteConfig(body);

    if (hasSupabaseConfig) {
      console.log("[SITE CONFIG API PUT PAYLOAD]", JSON.stringify(sanitized, null, 2));
      try {
        const updatedConfig = await siteConfigService.update(sanitized);
        console.log("[SITE CONFIG API PUT SUCCESS]", JSON.stringify(updatedConfig, null, 2));
        return NextResponse.json(updatedConfig);
      } catch (dbErr: any) {
        console.error('[SITE CONFIG API PUT SUPABASE ERROR]', dbErr);
        return NextResponse.json(
          {
            success: false,
            error: dbErr.message || "Database site-config update failed",
            details: dbErr
          },
          { status: 500 }
        );
      }
    }

    console.log("[SITE CONFIG API local cache save]");
    const current = read();
    const updated = { ...current, ...sanitized };
    writeFileSync(FILE_PATH, JSON.stringify(updated, null, 2));
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[SITE CONFIG API PUT SERVER ERROR]", error);
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

