import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Standard HTTP Response structures
export const apiResponse = {
  success: (data: any, status = 200) => {
    return NextResponse.json(
      { success: true, data },
      {
        status,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate'
        }
      }
    );
  },
  error: (message: string, code = "INTERNAL_SERVER_ERROR", details: any = null, status = 500) => {
    return NextResponse.json(
      {
        success: false,
        error: {
          message,
          code,
          details: details ? (typeof details === "string" ? details : JSON.stringify(details)) : ""
        }
      },
      {
        status,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate'
        }
      }
    );
  },
  notFound: (message = "Resource not found", code = "NOT_FOUND") => {
    return NextResponse.json(
      {
        success: false,
        error: {
          message,
          code,
          details: ""
        }
      },
      {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate'
        }
      }
    );
  },
  badRequest: (message = "Invalid payload parameters", code = "BAD_REQUEST", details: any = null) => {
    return NextResponse.json(
      {
        success: false,
        error: {
          message,
          code,
          details: details ? (typeof details === "string" ? details : JSON.stringify(details)) : ""
        }
      },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate'
        }
      }
    );
  },
};

// Centralized slug formatter
export function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

// Local cache filesystem persistence fallback helper
export function getLocalCacheHelper<T>(
  fileName: string,
  staticFileName?: string,
  initialSeed: T[] = []
) {
  const processDir = process.cwd();
  const dynamicPath = join(processDir, "src", "data", fileName);
  const staticPath = staticFileName ? join(processDir, "src", "data", staticFileName) : null;

  const read = (): T[] => {
    // 1. Try dynamic cache
    if (existsSync(dynamicPath)) {
      try {
        const data = JSON.parse(readFileSync(dynamicPath, "utf-8"));
        if (Array.isArray(data) && data.length > 0) return data;
      } catch {}
    }

    // 2. Try static seeding
    if (staticPath && existsSync(staticPath)) {
      try {
        const data = JSON.parse(readFileSync(staticPath, "utf-8"));
        if (Array.isArray(data)) {
          // Sync dynamically
          writeFileSync(dynamicPath, JSON.stringify(data, null, 2));
          return data;
        }
      } catch {}
    }

    // 3. Fallback to initialSeed parameter
    try {
      writeFileSync(dynamicPath, JSON.stringify(initialSeed, null, 2));
    } catch {}
    return initialSeed;
  };

  const write = (data: T[]): void => {
    try {
      writeFileSync(dynamicPath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(`⚠️ Failed writing dynamic cache for [${fileName}]:`, err);
    }
  };

  return { read, write };
}
