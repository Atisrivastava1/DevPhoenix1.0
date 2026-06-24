import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { ProgramHero } from "@/components/program/ProgramHero";
import { ProgramOverview } from "@/components/program/ProgramOverview";
import { ProgramCurriculum } from "@/components/program/ProgramCurriculum";
import { ProgramProjects } from "@/components/program/ProgramProjects";
import { ProgramPricing } from "@/components/program/ProgramPricing";
import { ProgramFAQ } from "@/components/program/ProgramFAQ";
import { ProgramLeadForm } from "@/components/program/ProgramLeadForm";
import { ProgramStickyCTA } from "@/components/program/ProgramStickyCTA";
import { programsService } from "@/services/supabase/db.service";
import { hasSupabaseConfig } from "@/services/supabase/client";
import { readFileSync } from "fs";
import { join } from "path";
import { Program } from "@/types";
import { courseJsonLd, faqJsonLd, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";

// ─── Data fetching ─────────────────────────────────────────────────────────────
async function getProgramBySlug(slug: string): Promise<Program | null> {
  let program: any = null;
  if (!hasSupabaseConfig) {
    try {
      const data = JSON.parse(readFileSync(join(process.cwd(), 'src/data/programs-dynamic.json'), 'utf-8'));
      program = data.find((p: any) => p.slug === slug || p.id === slug) || null;
    } catch {
      try {
        const data = JSON.parse(readFileSync(join(process.cwd(), 'src/data/programs-static.json'), 'utf-8'));
        program = data.find((p: any) => p.slug === slug || p.id === slug) || null;
      } catch { return null; }
    }
  } else {
    try {
      program = await programsService.getBySlug(slug);
    } catch {
      return null;
    }
  }

  if (!program) return null;

  return {
    ...program,
    practical_hours: program.practical_hours || program.practicalHours || "100+ Hours",
    pricing_details: program.pricing_details || program.pricingDetails || {
      originalPrice: program.originalPrice || "",
      discountedPrice: program.discountedPrice || program.price || "",
      emi: program.emi || null,
      includes: Array.isArray(program.includes) ? program.includes : []
    }
  };
}

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: 'Program Not Found' };

  const title = `${program.title} — DevPhoeniX`;
  const description = program.description;

  return {
    title,
    description,
    keywords: [program.title, program.category, ...(program.tags || []), 'DevPhoeniX', 'online course India'],
    alternates: { canonical: `https://devphoenix.tech/programs/${program.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://devphoenix.tech/programs/${program.slug}`,
      images: [{ url: program.image.startsWith('http') ? program.image : `https://devphoenix.tech${program.image}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProgramDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const jsonLd = [
    organizationJsonLd,
    courseJsonLd({ title: program.title, description: program.description, duration: program.duration, price: program.price, level: program.level, slug: program.slug }),
    breadcrumbJsonLd([
      { label: 'Home', href: '/' },
      { label: 'Programs', href: '/programs' },
      { label: program.title, href: `/programs/${program.slug}` },
    ]),
    ...(program.faqs && program.faqs.length > 0 ? [faqJsonLd(program.faqs)] : []),
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <Navbar />
      <main className="flex flex-col min-h-screen bg-white">
        <ProgramHero program={program} />
        <ProgramOverview program={program} />
        <ProgramCurriculum program={program} />
        <ProgramProjects program={program} />
        <ProgramPricing program={program} />
        <ProgramFAQ program={program} />
        <ProgramLeadForm program={program} />
      </main>
      <Footer />
      {/* Mobile sticky CTA — renders client-side only */}
      <ProgramStickyCTA program={program} />
    </>
  );
}
