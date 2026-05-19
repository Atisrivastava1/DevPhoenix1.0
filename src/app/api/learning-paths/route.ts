import { NextRequest, NextResponse } from 'next/server';
import { learningPathsService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { learningPathsData } from '@/data/learningPaths';
import { sanitizePayload } from '@/lib/api/sanitize-payload';

export const dynamic = 'force-dynamic';

const FILE_PATH = join(process.cwd(), 'src/data/learningPaths-dynamic.json');

// Helper to sanitize standard builds
const initialSeedData = learningPathsData.map(p => ({
  ...p,
  build: p.build.map(b => ({ text: b.text, icon: '' })) // Stringify/sanitize icon element for json compatibility
}));

function readLocalPaths() {
  if (!existsSync(FILE_PATH)) {
    try {
      writeFileSync(FILE_PATH, JSON.stringify(initialSeedData, null, 2));
    } catch (e) {
      console.error('Failed to write initial seed learning paths:', e);
    }
    return initialSeedData;
  }
  try {
    return JSON.parse(readFileSync(FILE_PATH, 'utf-8'));
  } catch {
    return initialSeedData;
  }
}

function writeLocalPaths(data: any[]) {
  try {
    writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write dynamic local learning paths:', e);
  }
}

if (!hasSupabaseConfig) {
  console.warn('⚠️ WARNING [Learning Paths API]: Supabase keys missing. Falling back to local JSON persistence.');
}

export async function GET() {
  console.log('GET /api/learning-paths invoked');
  if (!hasSupabaseConfig) {
    return NextResponse.json(readLocalPaths(), {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
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
    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
  } catch (error: any) {
    console.error('Error fetching learning paths from Supabase:', error);
    return NextResponse.json(readLocalPaths(), {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    const sanitized = sanitizePayload.learningPath(body);
    const newPath = {
      ...sanitized,
      created_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[LEARNING PATHS API local cache save]", newPath.id);
      const paths = readLocalPaths();
      paths.push(newPath);
      writeLocalPaths(paths);
      return NextResponse.json(newPath, { status: 201 });
    }

    console.log('[LEARNING PATHS API POST PAYLOAD]', JSON.stringify(newPath, null, 2));

    try {
      const created = await learningPathsService.create(newPath);
      console.log("[LEARNING PATHS API POST SUCCESS]", JSON.stringify(created, null, 2));
      return NextResponse.json(created, { status: 201 });
    } catch (dbErr: any) {
      console.error('[LEARNING PATHS API POST SUPABASE ERROR]', dbErr);
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
    console.error("[LEARNING PATHS API POST SERVER ERROR]", error);
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
      return NextResponse.json({ error: 'Learning path ID is required' }, { status: 400 });
    }

    // Sanitize and validate payload
    const sanitized = sanitizePayload.learningPath(body);
    const updatedPayload = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[LEARNING PATHS API local cache update]", body.id);
      const paths = readLocalPaths();
      const idx = paths.findIndex((p: any) => p.id === body.id);
      if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      paths[idx] = { ...paths[idx], ...updatedPayload };
      writeLocalPaths(paths);
      return NextResponse.json(paths[idx]);
    }

    console.log('[LEARNING PATHS API PUT PAYLOAD]', JSON.stringify(updatedPayload, null, 2));

    try {
      const updated = await learningPathsService.update(body.id, updatedPayload);
      console.log("[LEARNING PATHS API PUT SUCCESS]", JSON.stringify(updated, null, 2));
      return NextResponse.json(updated);
    } catch (dbErr: any) {
      console.error('[LEARNING PATHS API PUT SUPABASE ERROR]', dbErr);
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
    console.error("[LEARNING PATHS API PUT SERVER ERROR]", error);
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
      return NextResponse.json({ error: 'Learning path ID is required' }, { status: 400 });
    }

    console.log(`[LEARNING PATHS API DELETE ID]`, id);

    if (!hasSupabaseConfig) {
      const paths = readLocalPaths();
      writeLocalPaths(paths.filter((p: any) => p.id !== id));
      return NextResponse.json({ success: true });
    }

    try {
      await learningPathsService.delete(id);
      console.log("[LEARNING PATHS API DELETE SUCCESS]");
      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      console.error('[LEARNING PATHS API DELETE SUPABASE ERROR]', dbErr);
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
    console.error("[LEARNING PATHS API DELETE SERVER ERROR]", error);
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
