import fs from 'fs';
import path from 'path';
import { programsData } from '../src/data/programs';
import { learningPathsData } from '../src/data/learningPaths';
import { blogPosts } from '../src/data/blog';
import { showcaseProjectsData } from '../src/data/showcase';

const staticProgramsPath = path.resolve(__dirname, '../src/data/programs-static.json');
const dynamicProgramsPath = path.resolve(__dirname, '../src/data/programs-dynamic.json');

const staticPathsPath = path.resolve(__dirname, '../src/data/learningPaths-static.json');
const dynamicPathsPath = path.resolve(__dirname, '../src/data/learningPaths-dynamic.json');

const dynamicBlogsPath = path.resolve(__dirname, '../src/data/blog-dynamic.json');
const dynamicShowcasePath = path.resolve(__dirname, '../src/data/showcase-dynamic.json');

// Sync Programs
const programsJson = programsData.map(p => {
  const { icon, ...rest } = p;
  return {
    ...rest,
    practical_hours: p.practicalHours || "30–40 Hours",
    pricing_details: {
      originalPrice: p.pricingDetails.originalPrice,
      discountedPrice: p.pricingDetails.discountedPrice,
      emi: p.pricingDetails.emi || null,
      includes: p.pricingDetails.includes || []
    }
  };
});

fs.writeFileSync(staticProgramsPath, JSON.stringify(programsJson, null, 2), 'utf-8');
fs.writeFileSync(dynamicProgramsPath, JSON.stringify(programsJson, null, 2), 'utf-8');

// Sync Learning Paths
fs.writeFileSync(staticPathsPath, JSON.stringify(learningPathsData, null, 2), 'utf-8');
fs.writeFileSync(dynamicPathsPath, JSON.stringify(learningPathsData, null, 2), 'utf-8');

// Sync Blog Posts
const blogsJson = blogPosts.map((post, idx) => ({
  id: `blog-static-${idx}`,
  created_at: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  category: post.category,
  tags: (post as any).tags || [],
  read_time: post.readTime || "5 min read",
  published_at: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
  cover_image: post.image,
  is_published: true,
  author: post.author,
}));

fs.writeFileSync(dynamicBlogsPath, JSON.stringify(blogsJson, null, 2), 'utf-8');

// Sync Showcase
const showcaseJson = showcaseProjectsData.map((project: any, idx) => ({
  id: `showcase-static-${project.id || idx}`,
  title: project.title,
  description: project.description,
  image: project.image,
  tags: project.tags || project.tools || [],
  github_url: project.githubUrl || project.github_url || "https://github.com",
  live_url: project.liveUrl || project.live_url || "https://devphoenix.in",
  author_name: project.authorName || project.author_name || "Alumni Builder",
  program_name: project.programName || project.program_name || project.category || "Full Stack",
  created_at: new Date().toISOString()
}));

fs.writeFileSync(dynamicShowcasePath, JSON.stringify(showcaseJson, null, 2), 'utf-8');

console.log('✅ Successfully synchronized static and dynamic JSON files (Programs, Learning Paths, Blog Posts, and Showcase)!');
