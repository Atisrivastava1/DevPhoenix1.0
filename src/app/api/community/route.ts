import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const FILE_PATH = join(process.cwd(), 'src/data/community-dynamic.json');

const INITIAL_SEED = {
  features: [
    {
      title: "Mentorship That Matters",
      description: "Learn from industry experts who guide, review, and help you level up.",
      icon: "Users"
    },
    {
      title: "Real Feedback. Real Growth.",
      description: "Get actionable feedback on your projects and improve faster.",
      icon: "MessageSquare"
    },
    {
      title: "Builder Community",
      description: "Collaborate with ambitious builders, creators, and learners.",
      icon: "Globe"
    },
    {
      title: "Accountability & Consistency",
      description: "Track progress, build streaks, and stay motivated.",
      icon: "Target"
    }
  ],
  stats: [
    { value: "10K+", label: "Active Builders", subtext: "learning and growing together", icon: "Users" },
    { value: "300+", label: "Expert Mentors", subtext: "guiding your journey", icon: "UserCheck" },
    { value: "Live", label: "Daily Sessions", subtext: "workshops, Q&A and more", icon: "PlayCircle" },
    { value: "1M+", label: "Messages Exchanged", subtext: "collaborate, discuss, and build", icon: "MessageSquare" },
    { value: "Real", label: "Connections", subtext: "a network that stays with you forever", icon: "Rocket" }
  ],
  highlights: {
    mentorFeedback: {
      title: "Mentor Feedback",
      badge: "Mentor",
      quote: "Great implementation! 🔥 Consider optimizing the API caching layer and handling edge cases in the auth flow.",
      code: "export const fetchData = async () => {\n  await cache.set(data, { ttl: 3600 })\n}"
    },
    liveWorkshop: {
      title: "Live Workshop",
      badge: "Live",
      topic: "Building Scalable SaaS with Next.js",
      time: "Today, 7:00 PM",
      btnText: "Join Live Session"
    },
    streak: {
      title: "Learning Streak",
      value: "14",
      unit: "Days"
    }
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/devphoenix_technologies/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/112698008/admin/page-posts/published/" },
    { label: "Facebook", href: "https://www.facebook.com/share/1APNuoguqk/?mibextid=wwXIfr" }
  ]
};

function read() {
  if (!existsSync(FILE_PATH)) {
    writeFileSync(FILE_PATH, JSON.stringify(INITIAL_SEED, null, 2));
    return INITIAL_SEED;
  }
  try {
    return JSON.parse(readFileSync(FILE_PATH, 'utf-8'));
  } catch {
    return INITIAL_SEED;
  }
}

export async function GET() {
  return NextResponse.json(read());
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const current = read();
    const updated = { ...current, ...body };
    writeFileSync(FILE_PATH, JSON.stringify(updated, null, 2));
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
