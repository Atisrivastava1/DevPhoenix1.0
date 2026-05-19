import { NextRequest } from 'next/server';
import { visualBlocksService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';
import { apiResponse, getLocalCacheHelper } from '@/lib/api-utils';
import { sanitizePayload, ValidationError } from '@/lib/api/sanitize-payload';

export const dynamic = 'force-dynamic';

const INITIAL_SEED = [
  // ── Hero visuals ──
  {
    id: "hero-mascot",
    section_key: "hero",
    title: "DevPhoeniX Student Builder",
    subtitle: "",
    description: "Mascot illustration for landing header",
    image_url: "/learning.png",
    image_alt: "DevPhoeniX Student Builder",
    badge: "",
    cta_text: "",
    cta_link: "",
    position: 1,
    visibility: true,
    theme_variant: "orange",
    created_at: new Date().toISOString()
  },
  {
    id: "hero-card-1",
    section_key: "hero",
    title: "Your Journey",
    subtitle: "In Progress",
    description: "Floating status indicator card",
    image_url: "",
    image_alt: "",
    badge: "",
    cta_text: "",
    cta_link: "",
    position: 2,
    visibility: true,
    theme_variant: "glass",
    created_at: new Date().toISOString()
  },
  {
    id: "hero-card-2",
    section_key: "hero",
    title: "Build Your First Project",
    subtitle: "Next Milestone",
    description: "Floating code milestone card",
    image_url: "",
    image_alt: "",
    badge: "",
    cta_text: "",
    cta_link: "",
    position: 3,
    visibility: true,
    theme_variant: "glass",
    created_at: new Date().toISOString()
  },

  // ── Journey timeline steps ──
  {
    id: "journey-step-1",
    section_key: "journey",
    title: "Explore & Choose",
    subtitle: "",
    description: "Find the right premium or industrial program based on your career goals.",
    image_url: "",
    image_alt: "",
    badge: "Network",
    cta_text: "",
    cta_link: "",
    position: 1,
    visibility: true,
    theme_variant: "orange",
    created_at: new Date().toISOString()
  },
  {
    id: "journey-step-2",
    section_key: "journey",
    title: "Master the Foundations",
    subtitle: "",
    description: "Deep dive into core technologies with interactive, hands-on learning.",
    image_url: "",
    image_alt: "",
    badge: "TerminalSquare",
    cta_text: "",
    cta_link: "",
    position: 2,
    visibility: true,
    theme_variant: "blue",
    created_at: new Date().toISOString()
  },
  {
    id: "journey-step-3",
    section_key: "journey",
    title: "Build Real Systems",
    subtitle: "",
    description: "Execute production-grade projects. No more simple todo apps.",
    image_url: "",
    image_alt: "",
    badge: "Component",
    cta_text: "",
    cta_link: "",
    position: 3,
    visibility: true,
    theme_variant: "purple",
    created_at: new Date().toISOString()
  },
  {
    id: "journey-step-4",
    section_key: "journey",
    title: "Get Mentored",
    subtitle: "",
    description: "Receive code reviews and architectural guidance from top industry experts.",
    image_url: "",
    image_alt: "",
    badge: "CheckCircle",
    cta_text: "",
    cta_link: "",
    position: 4,
    visibility: true,
    theme_variant: "green",
    created_at: new Date().toISOString()
  },
  {
    id: "journey-step-5",
    section_key: "journey",
    title: "Launch Your Career",
    subtitle: "",
    description: "Earn your verified certification and confidently crush your interviews.",
    image_url: "",
    image_alt: "",
    badge: "Rocket",
    cta_text: "",
    cta_link: "",
    position: 5,
    visibility: true,
    theme_variant: "orange-bold",
    created_at: new Date().toISOString()
  },
  {
    id: "journey-mascot",
    section_key: "journey",
    title: "Transformation Journey Mascot Card",
    subtitle: "",
    description: "Transformation journey illustration graphic card",
    image_url: "/learning.png",
    image_alt: "Transformation Journey",
    badge: "",
    cta_text: "",
    cta_link: "",
    position: 6,
    visibility: true,
    theme_variant: "orange",
    created_at: new Date().toISOString()
  },

  // ── Mentorship pillars ──
  {
    id: "pillar-1",
    section_key: "mentorship",
    title: "Project-First Learning",
    subtitle: "",
    description: "Learn by building real-world projects from day one.",
    image_url: "",
    image_alt: "",
    badge: "Code2",
    cta_text: "Build → Deploy → Improve → Repeat",
    cta_link: "",
    position: 1,
    visibility: true,
    theme_variant: "glass",
    created_at: new Date().toISOString()
  },
  {
    id: "pillar-2",
    section_key: "mentorship",
    title: "AI-Native Education",
    subtitle: "",
    description: "Leverage AI tools, automation, and modern workflows in everything you build.",
    image_url: "",
    image_alt: "",
    badge: "Bot",
    cta_text: "AI is not the future. It's your edge.",
    cta_link: "",
    position: 2,
    visibility: true,
    theme_variant: "glass",
    created_at: new Date().toISOString()
  },
  {
    id: "pillar-3",
    section_key: "mentorship",
    title: "Builder Community",
    subtitle: "",
    description: "Join a community of ambitious learners, creators, and builders collaborating every day.",
    image_url: "",
    image_alt: "",
    badge: "Users",
    cta_text: "Learn together. Build together. Grow together.",
    cta_link: "",
    position: 3,
    visibility: true,
    theme_variant: "glass",
    created_at: new Date().toISOString()
  },
  {
    id: "pillar-4",
    section_key: "mentorship",
    title: "Mentorship & Feedback",
    subtitle: "",
    description: "Get guidance from industry mentors and receive actionable feedback on your work.",
    image_url: "",
    image_alt: "",
    badge: "UserCheck",
    cta_text: "Real mentors. Real feedback. Real growth.",
    cta_link: "",
    position: 4,
    visibility: true,
    theme_variant: "glass",
    created_at: new Date().toISOString()
  },
  {
    id: "pillar-mascot",
    section_key: "mentorship",
    title: "Ecosystem Success Mascot",
    subtitle: "",
    description: "Ecosystem Success Mascot illustration card",
    image_url: "/learning.png",
    image_alt: "Ecosystem Success Mascot",
    badge: "",
    cta_text: "",
    cta_link: "",
    position: 5,
    visibility: true,
    theme_variant: "glass",
    created_at: new Date().toISOString()
  },

  // ── Community visual illustration ──
  {
    id: "community-illustration",
    section_key: "community",
    title: "Community Collaboration Mascot Visual",
    subtitle: "",
    description: "Community interactive panel illustration",
    image_url: "/community/community-scene.png",
    image_alt: "Community Scene",
    badge: "",
    cta_text: "",
    cta_link: "",
    position: 1,
    visibility: true,
    theme_variant: "glass",
    created_at: new Date().toISOString()
  }
];

const cache = getLocalCacheHelper<any>('visual-blocks-dynamic.json', undefined, INITIAL_SEED);

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const items = await visualBlocksService.getAll();
      if (items && items.length > 0) {
        return apiResponse.success(items);
      }
      // If table exists but has 0 blocks, seed it with the INITIAL_SEED
      await visualBlocksService.saveAll(INITIAL_SEED);
      return apiResponse.success(INITIAL_SEED);
    } catch (err: any) {
      console.error('Supabase visual-blocks GET error, falling back to local:', err);
    }
  }
  return apiResponse.success(cache.read());
}

export async function PUT(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!Array.isArray(payload)) {
      return apiResponse.badRequest('Payload must be an array of visual blocks', "INVALID_PAYLOAD_TYPE");
    }

    // Sanitize and validate every block in the array
    const sanitizedArray = payload.map((block: any) => {
      try {
        return sanitizePayload.visualBlock(block);
      } catch (valErr: any) {
        if (valErr instanceof ValidationError) {
          throw valErr;
        }
        throw new ValidationError(valErr.message || "Validation failed on visual block");
      }
    });

    if (hasSupabaseConfig) {
      console.log(`[VISUAL BLOCKS API PUT ARRAY PAYLOAD COUNT: ${sanitizedArray.length}]`);
      try {
        await visualBlocksService.saveAll(sanitizedArray);
        console.log("[VISUAL BLOCKS API PUT SUCCESS]");
        return apiResponse.success({ success: true });
      } catch (dbErr: any) {
        console.error('[VISUAL BLOCKS API PUT SUPABASE ERROR]', dbErr);
        return apiResponse.error(dbErr.message || "Database save operation failed", "DATABASE_SAVE_FAILED", dbErr);
      }
    }

    console.log("[VISUAL BLOCKS API local cache save]");
    cache.write(sanitizedArray);
    return apiResponse.success({ success: true });
  } catch (err: any) {
    console.error("[VISUAL BLOCKS API PUT SERVER ERROR]", err);
    if (err instanceof ValidationError) {
      return apiResponse.badRequest(err.message, "VALIDATION_FAILED");
    }
    return apiResponse.error(err.message || 'Failed to process request', "SERVER_ERROR");
  }
}
