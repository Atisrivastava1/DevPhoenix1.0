"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "./SectionWrapper";
import { designSystem } from "@/lib/design-system";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { CardSkeleton } from "@/components/ui/Skeleton";

export function ProgramsPreview() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/programs', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const list = d && d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
        
        // Exactly the 3 featured programs in order
        const featuredSlugs = [
          'ai-prompt-engineering',
          'full-stack-mern-development',
          'data-science-machine-learning-generative-ai'
        ];
        
        const featured = featuredSlugs
          .map(slug => list.find((p: any) => p.slug === slug || p.id === slug))
          .filter(Boolean);

        setPrograms(featured);
        setLoading(false);
      })
      .catch(() => {
        setPrograms([]);
        setLoading(false);
      });
  }, []);

  const skeletons = [1, 2, 3];

  return (
    <SectionWrapper background="white" className="!pt-16 !pb-24 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-l from-orange-50/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-bold text-xs tracking-widest uppercase mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Featured Industrial Programs
          </motion.div>
          
          <motion.h2
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Build the Skills <br />
            <span className={designSystem.gradients.textOrangeRed}>Employers Actually Want</span>
          </motion.h2>
        </div>

        {/* 3 Featured Course Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {loading
            ? skeletons.map(i => (
                <div key={i} className="h-full">
                  <CardSkeleton />
                </div>
              ))
            : programs.length > 0
            ? programs.map((prog, idx) => (
                <motion.div
                  key={prog.id}
                  initial={designSystem.motion.fadeInUp.initial}
                  whileInView={designSystem.motion.fadeInUp.whileInView}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="h-full"
                >
                  <ProgramCard program={prog} ctaText="Explore Program" />
                </motion.div>
              ))
            : (
                <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-slate-50 rounded-2xl border border-slate-100">
                  No programs available.
                </div>
              )}
        </div>

        {/* View All Programs bottom CTA */}
        <div className="flex justify-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-500 transition-all duration-300 hover:scale-105 shadow-md shadow-slate-950/10 hover:shadow-orange-500/20"
            >
              View All Programs
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
