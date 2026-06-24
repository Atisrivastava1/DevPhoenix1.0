// src/lib/seo.ts
// Central SEO utility — generates metadata objects + JSON-LD structured data

const SITE_URL = 'https://devphoenix.tech';
const SITE_NAME = 'DevPhoeniX';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.png`;

// ─── Organization JSON-LD ──────────────────────────────────────────────────────
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DevPhoeniX',
  url: SITE_URL,
  logo: `${SITE_URL}/logo/devphoenix-logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9734876490',
    contactType: 'customer support',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.instagram.com/devphoenix_technologies/',
    'https://www.linkedin.com/company/112698008/',
    'https://www.facebook.com/share/1APNuoguqk/',
  ],
};

// ─── Course JSON-LD (for individual programs) ─────────────────────────────────
export function courseJsonLd(program: {
  title: string;
  description: string;
  duration: string;
  price: string;
  level: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.title,
    description: program.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      sameAs: SITE_URL,
    },
    url: `${SITE_URL}/programs/${program.slug}`,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      duration: program.duration,
    },
    offers: {
      '@type': 'Offer',
      price: program.price.replace(/[^\d]/g, '') || '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    educationalLevel: program.level,
  };
}

// ─── BlogPosting JSON-LD ──────────────────────────────────────────────────────
export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  image: string;
  author: { name: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo/devphoenix-logo.png` },
    },
    image: post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`,
  };
}

// ─── FAQPage JSON-LD ──────────────────────────────────────────────────────────
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

// ─── BreadcrumbList JSON-LD ───────────────────────────────────────────────────
export function breadcrumbJsonLd(crumbs: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href.startsWith('http') ? c.href : `${SITE_URL}${c.href}`,
    })),
  };
}

// ─── Page metadata helpers ─────────────────────────────────────────────────────
export function buildMetadata({
  title,
  description,
  keywords = [],
  image,
  path = '/',
  noIndex = false,
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  path?: string;
  noIndex?: boolean;
}) {
  const ogImage = image || DEFAULT_OG_IMAGE;
  const canonical = `${SITE_URL}${path}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: { canonical },
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website' as const,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [ogImage],
    },
  };
}
