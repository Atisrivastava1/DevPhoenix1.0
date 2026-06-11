"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SectionWrapper } from "@/components/sections/SectionWrapper";

import { designSystem } from "@/lib/design-system";
import { SchemaCard } from "@/components/ui/SchemaCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { PremiumEmptyState } from "@/components/ui/PremiumEmptyState";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/blog', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const list = d && d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
        if (list.length > 0) {
          setPosts(list);
        }
      })
      .catch(() => setPosts([]));
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-24 bg-[#FFF9F5]">
        
        {/* Blog Header with Canvas Animation */}
        <SectionWrapper background="cream" className="pb-8 lg:pb-12 border-b border-orange-100/50">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              animate={designSystem.motion.fadeInUp.whileInView}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              BUILDER INSIGHTS
            </motion.div>
            <motion.h1 
              initial={designSystem.motion.fadeInUp.initial}
              animate={designSystem.motion.fadeInUp.whileInView}
              transition={{ delay: 0.1 }}
              className={`${designSystem.typography.hero} mb-6 text-slate-900`}
            >
              The DevPhoeniX <span className={designSystem.gradients.textOrangeRed}>Journal</span>
            </motion.h1>
            <motion.p 
              initial={designSystem.motion.fadeInUp.initial}
              animate={designSystem.motion.fadeInUp.whileInView}
              transition={{ delay: 0.2 }}
              className={`${designSystem.typography.body} max-w-2xl mx-auto`}
            >
              Premium educational guides, startup execution insights, and deep-dives into the AI-native ecosystem.
            </motion.p>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 w-full">
             <SchemaCard />
          </div>
        </SectionWrapper>

        {/* Blog Grid */}
        <SectionWrapper background="white">
          <div className="max-w-7xl mx-auto">
            {posts.length === 0 ? (
              <PremiumEmptyState
                title="No Articles Published Yet"
                description="Our tech writers are in the lab building case studies and guides. Join our newsletter to get notified on launch!"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, idx) => (
                  <motion.div 
                    key={post.slug || post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                    className="h-full"
                  >
                    <BlogCard post={post as any} className="h-full" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </SectionWrapper>

      </div>
      <Footer />
    </>
  );
}

