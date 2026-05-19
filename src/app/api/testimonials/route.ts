import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { testimonialsService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';
import { sanitizePayload } from '@/lib/api/sanitize-payload';

export const dynamic = 'force-dynamic';

const FILE_PATH = join(process.cwd(), 'src/data/testimonials.json');

function read() {
  try { return JSON.parse(readFileSync(FILE_PATH, 'utf-8')); }
  catch { return []; }
}

function write(data: any[]) {
  writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const items = await testimonialsService.getAll();
      return NextResponse.json(items);
    } catch (err: any) {
      console.error('Supabase testimonials GET error, falling back to local:', err);
    }
  }
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    const sanitized = sanitizePayload.testimonial(body);
    const newItem = {
      ...sanitized,
      created_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[TESTIMONIALS API local cache save]", newItem.id);
      const items = read();
      items.push(newItem);
      write(items);
      return NextResponse.json(newItem, { status: 201 });
    }

    console.log("[TESTIMONIALS API POST PAYLOAD]", JSON.stringify(newItem, null, 2));

    try {
      const created = await testimonialsService.create(newItem);
      console.log("[TESTIMONIALS API POST SUCCESS]", JSON.stringify(created, null, 2));
      return NextResponse.json(created, { status: 201 });
    } catch (dbErr: any) {
      console.error('[TESTIMONIALS API POST SUPABASE ERROR]', dbErr);
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
    console.error("[TESTIMONIALS API POST SERVER ERROR]", error);
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
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    // Sanitize and validate payload
    const sanitized = sanitizePayload.testimonial(body);
    const updatedPayload = {
      ...sanitized,
      updated_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      console.log("[TESTIMONIALS API local cache update]", body.id);
      const items = read();
      const idx = items.findIndex((i: any) => i.id === body.id);
      if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      items[idx] = { ...items[idx], ...updatedPayload };
      write(items);
      return NextResponse.json(items[idx]);
    }

    console.log("[TESTIMONIALS API PUT PAYLOAD]", JSON.stringify(updatedPayload, null, 2));

    try {
      const updated = await testimonialsService.update(body.id, updatedPayload);
      console.log("[TESTIMONIALS API PUT SUCCESS]", JSON.stringify(updated, null, 2));
      return NextResponse.json(updated);
    } catch (dbErr: any) {
      console.error('[TESTIMONIALS API PUT SUPABASE ERROR]', dbErr);
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
    console.error("[TESTIMONIALS API PUT SERVER ERROR]", error);
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
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    console.log("[TESTIMONIALS API DELETE ID]", id);

    if (!hasSupabaseConfig) {
      write(read().filter((i: any) => i.id !== id));
      return NextResponse.json({ success: true });
    }

    try {
      await testimonialsService.delete(id);
      console.log("[TESTIMONIALS API DELETE SUCCESS]");
      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      console.error('[TESTIMONIALS API DELETE SUPABASE ERROR]', dbErr);
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
    console.error("[TESTIMONIALS API DELETE SERVER ERROR]", error);
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

