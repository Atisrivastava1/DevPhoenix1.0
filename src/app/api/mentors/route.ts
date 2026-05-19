import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { mentorsService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';
import { sanitizePayload } from '@/lib/api/sanitize-payload';

export const dynamic = 'force-dynamic';

const FILE_PATH = join(process.cwd(), 'src/data/mentors.json');

function read() {
  try { return JSON.parse(readFileSync(FILE_PATH, 'utf-8')); }
  catch { return []; }
}

function write(d: any[]) {
  writeFileSync(FILE_PATH, JSON.stringify(d, null, 2));
}

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const items = await mentorsService.getAll();
      return NextResponse.json(items);
    } catch (err: any) {
      console.error('Supabase mentors GET error, falling back to local:', err);
    }
  }
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    const sanitized = sanitizePayload.mentor(body);
    const newMentor = {
      ...sanitized,
      created_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[MENTORS API local cache save]", newMentor.id);
      const items = read();
      items.push(newMentor);
      write(items);
      return NextResponse.json(newMentor, { status: 201 });
    }

    console.log("[MENTORS API POST PAYLOAD]", JSON.stringify(newMentor, null, 2));

    try {
      const created = await mentorsService.create(newMentor);
      console.log("[MENTORS API POST SUCCESS]", JSON.stringify(created, null, 2));
      return NextResponse.json(created, { status: 201 });
    } catch (dbErr: any) {
      console.error('[MENTORS API POST SUPABASE ERROR]', dbErr);
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
    console.error("[MENTORS API POST SERVER ERROR]", error);
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
      return NextResponse.json({ error: 'Mentor ID is required' }, { status: 400 });
    }

    // Sanitize and validate payload
    const sanitized = sanitizePayload.mentor(body);
    const updatedPayload = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[MENTORS API local cache update]", body.id);
      const items = read();
      const i = items.findIndex((x: any) => x.id === body.id);
      if (i === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      items[i] = { ...items[i], ...updatedPayload };
      write(items);
      return NextResponse.json(items[i]);
    }

    console.log("[MENTORS API PUT PAYLOAD]", JSON.stringify(updatedPayload, null, 2));

    try {
      const updated = await mentorsService.update(body.id, updatedPayload);
      console.log("[MENTORS API PUT SUCCESS]", JSON.stringify(updated, null, 2));
      return NextResponse.json(updated);
    } catch (dbErr: any) {
      console.error('[MENTORS API PUT SUPABASE ERROR]', dbErr);
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
    console.error("[MENTORS API PUT SERVER ERROR]", error);
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
      return NextResponse.json({ error: 'Mentor ID is required' }, { status: 400 });
    }

    console.log("[MENTORS API DELETE ID]", id);

    if (!hasSupabaseConfig) {
      write(read().filter((x: any) => x.id !== id));
      return NextResponse.json({ success: true });
    }

    try {
      await mentorsService.delete(id);
      console.log("[MENTORS API DELETE SUCCESS]");
      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      console.error('[MENTORS API DELETE SUPABASE ERROR]', dbErr);
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
    console.error("[MENTORS API DELETE SERVER ERROR]", error);
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

