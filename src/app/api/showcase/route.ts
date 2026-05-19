import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { showcaseProjectsData } from '@/data/showcase';
import { showcaseService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';
import { sanitizePayload } from '@/lib/api/sanitize-payload';

export const dynamic = 'force-dynamic';

const FILE_PATH = join(process.cwd(), 'src/data/showcase-dynamic.json');

const INITIAL_SEED = showcaseProjectsData.map((project, idx) => ({
  ...project,
  id: `showcase-static-${project.id || idx}`
}));

function read() {
  if (!existsSync(FILE_PATH)) {
    writeFileSync(FILE_PATH, JSON.stringify(INITIAL_SEED, null, 2));
    return INITIAL_SEED;
  }
  try {
    const data = JSON.parse(readFileSync(FILE_PATH, 'utf-8'));
    if (!Array.isArray(data) || data.length === 0) {
      writeFileSync(FILE_PATH, JSON.stringify(INITIAL_SEED, null, 2));
      return INITIAL_SEED;
    }
    return data;
  } catch {
    return INITIAL_SEED;
  }
}

function write(d: any[]) {
  writeFileSync(FILE_PATH, JSON.stringify(d, null, 2));
}

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const items = await showcaseService.getAll();
      return NextResponse.json(items);
    } catch (err: any) {
      console.error('Supabase showcase GET error, falling back to local:', err);
    }
  }
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    const sanitized = sanitizePayload.showcase(body);
    const newProject = {
      ...sanitized,
      created_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[SHOWCASE API local cache save]", newProject.id);
      const items = read();
      items.push(newProject);
      write(items);
      return NextResponse.json(newProject, { status: 201 });
    }

    console.log("[SHOWCASE API POST PAYLOAD]", JSON.stringify(newProject, null, 2));

    try {
      const created = await showcaseService.create(newProject);
      console.log("[SHOWCASE API POST SUCCESS]", JSON.stringify(created, null, 2));
      return NextResponse.json(created, { status: 201 });
    } catch (dbErr: any) {
      console.error('[SHOWCASE API POST SUPABASE ERROR]', dbErr);
      return NextResponse.json(
        {
          success: false,
          error: dbErr.message || "Database insert operation failed",
          details: dbErr
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[SHOWCASE API POST SERVER ERROR]", error);
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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Sanitize and validate payload
    const sanitized = sanitizePayload.showcase(body);
    const updatedPayload = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[SHOWCASE API local cache update]", body.id);
      const items = read();
      const i = items.findIndex((x: any) => x.id === body.id);
      if (i === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      items[i] = { ...items[i], ...updatedPayload };
      write(items);
      return NextResponse.json(items[i]);
    }

    console.log("[SHOWCASE API PUT PAYLOAD]", JSON.stringify(updatedPayload, null, 2));

    try {
      const updated = await showcaseService.update(body.id, updatedPayload);
      console.log("[SHOWCASE API PUT SUCCESS]", JSON.stringify(updated, null, 2));
      return NextResponse.json(updated);
    } catch (dbErr: any) {
      console.error('[SHOWCASE API PUT SUPABASE ERROR]', dbErr);
      return NextResponse.json(
        {
          success: false,
          error: dbErr.message || "Database update operation failed",
          details: dbErr
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[SHOWCASE API PUT SERVER ERROR]", error);
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

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    console.log("[SHOWCASE API DELETE ID]", id);

    if (!hasSupabaseConfig) {
      write(read().filter((x: any) => x.id !== id));
      return NextResponse.json({ success: true });
    }

    try {
      await showcaseService.delete(id);
      console.log("[SHOWCASE API DELETE SUCCESS]");
      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      console.error('[SHOWCASE API DELETE SUPABASE ERROR]', dbErr);
      return NextResponse.json(
        {
          success: false,
          error: dbErr.message || "Database delete operation failed",
          details: dbErr
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[SHOWCASE API DELETE SERVER ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process request",
        details: error
      },
      { status: 500 }
    );
  }
}

