import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ChevronLeft, Share2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { blogPosts as staticBlogPosts } from "@/data/blog";
import { blogPostingJsonLd, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";
import { DynamicImage } from "@/components/ui/DynamicImage";
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ─── Dynamic JSON Helper ──────────────────────────────────────────────────────
function getBlogPosts() {
  const FILE_PATH = join(process.cwd(), 'src/data/blog-dynamic.json');
  let rawList = staticBlogPosts;
  if (existsSync(FILE_PATH)) {
    try {
      const data = JSON.parse(readFileSync(FILE_PATH, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) rawList = data;
    } catch {}
  }
  return rawList.map((post: any) => ({
    ...post,
    cover_image: post.cover_image || post.coverImage || post.image,
    published_at: post.published_at || post.publishedAt || post.date,
    read_time: post.read_time || post.readTime || "5 min read",
    is_published: typeof post.is_published === "boolean" ? post.is_published : (typeof post.isPublished === "boolean" ? post.isPublished : post.published === true || false)
  }));
}

// ─── Dynamic Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = getBlogPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) return { title: 'Blog Post Not Found' };
  return {
    title: `${post.title} — DevPhoeniX Blog`,
    description: post.excerpt,
    keywords: [post.category, 'DevPhoeniX', 'builder', 'AI', 'tech education'],
    alternates: { canonical: `https://devphoenix.tech/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `https://devphoenix.tech/blog/${post.slug}`,
      images: [{ url: post.cover_image.startsWith('http') ? post.cover_image : `https://devphoenix.tech${post.cover_image}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getBlogPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = posts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  const jsonLd = [
    organizationJsonLd,
    blogPostingJsonLd({ title: post.title, excerpt: post.excerpt, slug: post.slug, date: post.published_at, image: post.cover_image, author: post.author }),
    breadcrumbJsonLd([
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: post.title, href: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <Navbar />
      <div className="flex flex-col min-h-screen pt-24 bg-white">

        {/* Article Header */}
        <SectionWrapper background="white" className="!pb-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors mb-8 group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
            </Link>

            <div className="flex items-center gap-3 text-xs font-semibold text-orange-600 uppercase tracking-widest mb-4">
              <span>{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-orange-300" />
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.read_time}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-slate-900 leading-[1.2]">{post.title}</h1>

            <div className="flex items-center justify-between py-6 border-y border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                  <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{post.author.name}</p>
                  <p className="text-sm text-slate-500">{post.author.role} · {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</p>
                </div>
              </div>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://devphoenix.tech/blog/${post.slug}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </a>
            </div>
          </div>
        </SectionWrapper>

        {/* Featured Image */}
        <SectionWrapper background="white" className="!py-0">
          <div className="max-w-5xl mx-auto relative w-full aspect-[21/9] overflow-hidden rounded-3xl bg-slate-50 border border-slate-100">
            <DynamicImage src={post.cover_image} alt={post.title} fill priority className="object-cover" category={post.category} />
          </div>
        </SectionWrapper>

        {/* Article Body */}
        <SectionWrapper background="white">
          <div className="max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-extrabold prose-h2:text-3xl prose-h2:text-slate-900 prose-h3:text-2xl prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-orange-500" dangerouslySetInnerHTML={{ __html: post.content }} />
        </SectionWrapper>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <SectionWrapper background="cream">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map(rp => (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-orange-200 hover:shadow-md transition-all">
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">{rp.category}</p>
                    <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">{rp.title}</h3>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{rp.excerpt}</p>
                    <p className="text-xs text-orange-500 font-bold mt-4">Read article →</p>
                  </Link>
                ))}
              </div>
            </div>
          </SectionWrapper>
        )}
      </div>
      <Footer />
    </>
  );
}
