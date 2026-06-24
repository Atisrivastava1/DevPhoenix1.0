import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#\s][^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
    }
  });
}

// Import static data
import { programsData } from './src/data/programs';
import { learningPathsData } from './src/data/learningPaths';
import { blogPosts } from './src/data/blog';
import { testimonials } from './src/data/testimonials';
import { showcaseProjectsData } from './src/data/showcase';

import { contactInfo, socialLinks } from './src/data/community';
import { navItems } from './src/data/navigation';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('devphoenix'); // Or whatever DB name is configured if specified in URI
    
    // Seed Programs
    const programsCol = db.collection('programs');
    console.log('Dropping existing programs...');
    await programsCol.deleteMany({});
    if (programsData.length > 0) {
      console.log('Seeding programs...');
      await programsCol.insertMany(programsData.map(p => ({ ...p, created_at: new Date().toISOString() })));
    }

    // Seed Learning Paths
    const lpCol = db.collection('learning_paths');
    const lpCount = await lpCol.countDocuments();
    if (lpCount === 0 && learningPathsData.length > 0) {
      console.log('Seeding learning_paths...');
      await lpCol.insertMany(learningPathsData.map(lp => ({ ...lp, created_at: new Date().toISOString() })));
    }

    // Seed Blogs
    const bCol = db.collection('blogs');
    const bCount = await bCol.countDocuments();
    if (bCount === 0 && blogPosts.length > 0) {
      console.log('Seeding blogs...');
      await bCol.insertMany(blogPosts.map((b, i) => ({ 
        ...b, 
        id: `blog-static-${i}`,
        created_at: new Date().toISOString(),
        published_at: b.date || new Date().toISOString(),
        is_published: true,
        cover_image: b.image || ''
      })));
    }

    // Seed Testimonials
    const tCol = db.collection('testimonials');
    const tCount = await tCol.countDocuments();
    if (tCount === 0 && testimonials.length > 0) {
      console.log('Seeding testimonials...');
      await tCol.insertMany(testimonials.map(t => ({ ...t, created_at: new Date().toISOString() })));
    }

    // Seed Showcase
    const sCol = db.collection('showcase');
    const sCount = await sCol.countDocuments();
    if (sCount === 0 && showcaseProjectsData.length > 0) {
      console.log('Seeding showcase...');
      await sCol.insertMany(showcaseProjectsData.map(s => ({ ...s, created_at: new Date().toISOString() })));
    }

    // Seed Site Config
    console.log('Force overwriting site_config...');
    const scCol = db.collection('site_config');
    await scCol.updateOne(
      { id: 'global' },
      { 
        $set: {
          hero: {},
          contact: { email: "contact@devphoenix.com", phone: "+91 9734876490" },
          socials: {
            instagram: "https://www.instagram.com/devphoenix_technologies/",
            linkedin: "https://www.linkedin.com/company/112698008/",
            facebook: "https://www.facebook.com/share/1APNuoguqk/?mibextid=wwXIfr",
            twitter: "",
            github: ""
          },
          footer: {
            tagline: "Building AI-native builders, creators, and future-ready innovators. Real projects. Real systems. Real careers.",
            copyright: `© 2026 DevPhoeniX Technologies. All rights reserved.`,
          },
          footerColumns: [
            {
              title: "Platform",
              links: [
                { label: "Learning Paths", href: "/learning-paths" },
                { label: "Programs", href: "/programs" },
                { label: "Builder Showcase", href: "/showcase" },
                { label: "Community", href: "/community" },
                { label: "Blog", href: "/blog" },
                { label: "About", href: "/about" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "Mentorship", href: "/mentors" },
                { label: "Industrial Training", href: "/programs#industrial" },
                { label: "Certifications", href: "/programs" },
                { label: "Student Projects", href: "/showcase" },
                { label: "FAQs", href: "/#faq" },
                { label: "Contact", href: "mailto:contact@devphoenix.com" },
              ],
            },
          ],
          navItems: navItems
        }
      },
      { upsert: true }
    );


    console.log('✅ Seed complete!');
  } catch (err) {
    console.error('Error seeding DB:', err);
  } finally {
    await client.close();
  }
}

seed();
