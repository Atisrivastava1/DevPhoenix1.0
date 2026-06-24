import { NextResponse } from 'next/server';
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { cloudinaryService, hasCloudinaryConfig } from '@/services/cloudinary/storage.service';

export const dynamic = 'force-dynamic';


// ── Collect all image URLs referenced in data files ────────────────────────────
function harvestDataImages(): { name: string; url: string; folder: string; source: string }[] {
  const results: { name: string; url: string; folder: string; source: string }[] = [];

  const addUrl = (url: string, folder: string, source: string) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return;
    const name = url.split('/').pop()?.split('?')[0] || url;
    results.push({ name, url, folder, source });
  };

  // Programs
  try {
    const programs = JSON.parse(readFileSync(join(process.cwd(), 'src/data/programs-dynamic.json'), 'utf-8'));
    programs.forEach((p: any) => addUrl(p.image, 'programs', p.title));
  } catch {}
  
  // Mentors
  try {
    const mentors = JSON.parse(readFileSync(join(process.cwd(), 'src/data/mentors.json'), 'utf-8'));
    mentors.forEach((m: any) => addUrl(m.avatar, 'mentors', m.name));
  } catch {}

  // Testimonials API data (json if written)
  try {
    const testimonials = JSON.parse(readFileSync(join(process.cwd(), 'src/data/testimonials-dynamic.json'), 'utf-8'));
    testimonials.forEach((t: any) => addUrl(t.avatar, 'testimonials', t.name));
  } catch {}

  // Blog
  try {
    const blogs = JSON.parse(readFileSync(join(process.cwd(), 'src/data/blog-dynamic.json'), 'utf-8'));
    blogs.forEach((b: any) => {
      addUrl(b.image || b.coverImage, 'blogs', b.title);
      addUrl(b.author?.avatar, 'blogs', `Author: ${b.author?.name}`);
    });
  } catch {}

  // Showcase
  try {
    const showcase = JSON.parse(readFileSync(join(process.cwd(), 'src/data/showcase-dynamic.json'), 'utf-8'));
    showcase.forEach((s: any) => addUrl(s.image, 'showcase', s.title));
  } catch {}

  // Site config
  try {
    const config = JSON.parse(readFileSync(join(process.cwd(), 'src/data/site-config.json'), 'utf-8'));
    addUrl(config.ogImage, 'seo', 'OG Image');
    addUrl(config.logo, 'branding', 'Logo');
  } catch {}

  return results;
}

// ── Collect local /public images ──────────────────────────────────────────────
function harvestPublicImages(): { name: string; url: string; folder: string; source: string; size: number }[] {
  const results: { name: string; url: string; folder: string; source: string; size: number }[] = [];
  const publicDir = join(process.cwd(), 'public');
  const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif'];

  function scan(dir: string, prefix: string) {
    try {
      const items = readdirSync(dir);
      for (const item of items) {
        const full = join(dir, item);
        const stat = statSync(full);
        if (stat.isDirectory()) {
          scan(full, `${prefix}/${item}`);
        } else {
          const ext = item.toLowerCase().slice(item.lastIndexOf('.'));
          if (IMAGE_EXTS.includes(ext)) {
            const url = `${prefix}/${item}`;
            const folder = prefix.replace('/', '') || 'root';
            results.push({ name: item, url, folder: folder.split('/')[0], source: 'public', size: stat.size });
          }
        }
      }
    } catch {}
  }

  scan(publicDir, '');
  return results;
}

export async function GET() {
  const dataImages = harvestDataImages();
  const publicImages = harvestPublicImages();

  // Deduplicate by url
  const seen = new Set<string>();
  const all = [
    ...publicImages.map((i, idx) => ({ id: `pub-${idx}`, ...i, sizeLabel: formatSize(i.size) })),
    ...dataImages
      .filter(i => !seen.has(i.url) && !seen.add(i.url))
      .map((i, idx) => ({ id: `dat-${idx}`, ...i, sizeLabel: 'external', size: 0 })),
  ];

  return NextResponse.json(all);
}

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Upload to Cloudinary if configured
    if (hasCloudinaryConfig) {
      const publicUrl = await cloudinaryService.uploadFile(file, folder);
      return NextResponse.json({ url: publicUrl, name: file.name });
    }

    // Local disk fallback
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Deconflict name
    const ext = file.name.split('.').pop();
    const cleanName = `${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${ext}`;
    const filePath = join(uploadsDir, cleanName);
    
    writeFileSync(filePath, buffer);
    const localUrl = `/uploads/${cleanName}`;
    
    return NextResponse.json({ url: localUrl, name: cleanName });
  } catch (err: any) {
    console.error('API Media Upload Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to upload media' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Delete from Cloudinary if it's a Cloudinary URL
    if (hasCloudinaryConfig && url.includes('res.cloudinary.com')) {
      await cloudinaryService.deleteFile(url);
      return NextResponse.json({ success: true });
    }

    // Local disk delete
    if (url.startsWith('/uploads/')) {
      const filename = url.replace('/uploads/', '');
      const filePath = join(process.cwd(), 'public', 'uploads', filename);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ success: true, message: 'No file deleted' });
  } catch (err: any) {
    console.error('API Media Delete Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete media' }, { status: 500 });
  }
}
