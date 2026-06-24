"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { Testimonials } from "@/components/sections/Testimonials";
import { designSystem } from "@/lib/design-system";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    fetch('/api/programs', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const raw = data.success && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        
        // Exact order of the 9 programs
        const orderSlugs = [
          'ai-prompt-engineering',
          'full-stack-mern-development',
          'data-science-machine-learning-generative-ai',
          'data-analytics-business-intelligence',
          'cloud-devops-engineering',
          'dsa-python',
          'digital-marketing-growth-strategy',
          'startup-entrepreneurship',
          'advanced-excel-business-analytics'
        ];

        const sorted = orderSlugs
          .map(slug => raw.find((p: any) => p.slug === slug || p.id === slug))
          .filter(Boolean);

        setPrograms(sorted);
        setLoading(false);
      })
      .catch(() => {
        setPrograms([]);
        setLoading(false);
      });

    const TARGET_DATE = new Date("2026-07-02T23:59:00+05:30").getTime();
    if (Date.now() >= TARGET_DATE) {
      setExpired(true);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-24 bg-white">
        
        {/* Page Hero */}
        <SectionWrapper background="white" className="py-20 lg:py-24 border-b border-slate-100 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col items-center text-center relative z-10 max-w-5xl mx-auto">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-bold text-xs tracking-widest uppercase mb-8 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              INDUSTRY-ORIENTED LEARNING
            </motion.div>
 
            <motion.h1
              initial={designSystem.motion.fadeInUp.initial}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight"
            >
              Master the Skills <br className="hidden md:block"/>
              That <span className={designSystem.gradients.textOrangeRed}>Build Careers</span>
            </motion.h1>
 
            <motion.p
              initial={designSystem.motion.fadeInUp.initial}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-12"
            >
              Hands-on practical training designed for real-world execution. Build complete portfolios, earn verified certifications, and step into the industry with confidence.
            </motion.p>
 
            {/* Offer Info Row */}
            <motion.div 
              initial={designSystem.motion.fadeInUp.initial}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full max-w-2xl bg-slate-50 border border-slate-200/60 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
            >
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Flat Enrollment Fee</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">₹1,249</span>
                  <span className="text-slate-400 line-through text-sm font-semibold">₹6,999</span>
                </div>
                <span className="text-xs font-semibold text-orange-600 mt-1">Offer Valid Till: 2 July 2026</span>
              </div>
              <div className="w-full md:w-auto min-w-[200px]">
                <CountdownTimer onExpire={() => setExpired(true)} />
              </div>
            </motion.div>
          </div>
        </SectionWrapper>
 
        {/* All Industrial Programs Grid */}
        <SectionWrapper background="white" id="programs-grid" className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col mb-16 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Industrial Training Programs
              </h2>
              <p className="text-slate-500 max-w-2xl text-lg">
                Accelerated 30-40 hours practical training cohorts led by industry practitioners.
              </p>
            </div>
 
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : programs.length === 0 ? (
              <div className="py-16 text-center text-slate-500 font-semibold bg-slate-50 border border-slate-100 rounded-2xl">
                No programs available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map((prog, idx) => (
                  <motion.div
                    key={prog.id}
                    initial={designSystem.motion.fadeInUp.initial}
                    whileInView={designSystem.motion.fadeInUp.whileInView}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 3) * 0.1 }}
                  >
                    <ProgramCard program={prog} ctaText="View Curriculum" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </SectionWrapper>
        
        <Testimonials />
      </div>
      <Footer />
    </>
  );
}
