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
        setPrograms(list.slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        setPrograms([]);
        setLoading(false);
      });
  }, []);

  // Skeleton placeholders while loading
  const skeletons = [1, 2, 3];


  return (
    <SectionWrapper background="white" className="!pt-12 lg:!pt-16 !pb-20 lg:!pb-24 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-l from-orange-50/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col items-start max-w-2xl">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              INDUSTRY PROGRAMS
            </motion.div>
            <motion.h2
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={designSystem.typography.sectionTitle}
            >
              Build the Skills <br />
              <span className={designSystem.gradients.textOrangeRed}>Employers Actually Want</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-full hover:bg-orange-500 transition-colors shadow-sm"
            >
              Explore All Programs
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-6 md:gap-8 pb-8 md:pb-0 md:grid-cols-2 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {loading
            ? skeletons.map(i => (
                <div key={i} className="h-full min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0">
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
                  className="h-full min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0"
                >
                  <ProgramCard program={prog} />
                </motion.div>
              ))
            : (
                <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-slate-50 rounded-2xl border border-slate-100">
                  No programs available.
                </div>
              )}
        </div>
      </div>
    </SectionWrapper>
  );
}
