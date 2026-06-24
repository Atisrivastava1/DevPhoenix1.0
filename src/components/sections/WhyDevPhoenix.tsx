"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Code2, Bot, Users, UserCheck } from "lucide-react";
import Image from "next/image";
import { SectionWrapper } from "./SectionWrapper";

const whyChecklist = [
  "Project-first, always",
  "AI-native learning",
  "Real-world execution",
  "Community-driven growth"
];

const FALLBACK_PILLARS = [
  {
    title: "Project-First Learning",
    description: "Learn by building real-world projects from day one.",
    footerTag: "Build → Deploy → Improve → Repeat",
    badge: "Code2"
  },
  {
    title: "AI-Native Education",
    description: "Leverage AI tools, automation, and modern workflows in everything you build.",
    footerTag: "AI is not the future. It's your edge.",
    badge: "Bot"
  },
  {
    title: "Builder Community",
    description: "Join a community of ambitious learners, creators, and builders collaborating every day.",
    footerTag: "Learn together. Build together. Grow together.",
    badge: "Users"
  },
  {
    title: "Mentorship & Feedback",
    description: "Get guidance from industry mentors and receive actionable feedback on your work.",
    footerTag: "Real mentors. Real feedback. Real growth.",
    badge: "UserCheck"
  }
];

export function WhyDevPhoenix() {
  const [visualBlocks, setVisualBlocks] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('/api/visual-blocks');
      if (cached) {
        try {
          const { val, expiry } = JSON.parse(cached);
          if (expiry > Date.now() && Array.isArray(val)) {
            setVisualBlocks(val.filter((b: any) => b.section_key === 'mentorship' && b.visibility));
          }
        } catch {}
      }
    }

    fetch('/api/visual-blocks', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const list = d && d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
        setVisualBlocks(list.filter((b: any) => b.section_key === 'mentorship' && b.visibility));
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('/api/visual-blocks', JSON.stringify({
            val: list,
            expiry: Date.now() + 60000 // Cache for 1 minute
          }));
        }
      })
      .catch(() => {});
  }, []);

  const mascotBlock = visualBlocks.find(b => b.id === 'pillar-mascot');
  const uniquePillarBlocks = Array.from(
    new Map(
      visualBlocks
        .filter(b => b.id !== 'pillar-mascot')
        .sort((a, b) => a.position - b.position)
        .map(b => [b.id, b])
    ).values()
  );

  const pillarBlocks = uniquePillarBlocks;

  // Map badge string to Lucide Icon
  const getIcon = (name: string) => {
    if (name === 'Code2') return <Code2 className="w-6 h-6" />;
    if (name === 'Bot') return <Bot className="w-6 h-6" />;
    if (name === 'Users') return <Users className="w-6 h-6" />;
    return <UserCheck className="w-6 h-6" />;
  };

  const pillars = pillarBlocks.length > 0
    ? pillarBlocks.map(b => ({
        title: b.title,
        description: b.description,
        footerTag: b.cta_text,
        icon: getIcon(b.badge)
      }))
    : FALLBACK_PILLARS.map(p => ({
        ...p,
        icon: getIcon(p.badge)
      }));

  const mascotImage = mascotBlock?.image_url || "/learning.png";

  return (
    <SectionWrapper background="white" className="!pb-2 lg:!pb-6">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-[4rem]">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-300/10 rounded-full blur-[100px]" />
      </div>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        <div className="lg:col-span-5 flex flex-col items-start relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">WHY DEVPHOENIX?</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight"
          >
            More Than Courses.<br />
            A Builder Ecosystem<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 drop-shadow-sm">
              For The Future.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg"
          >
            We don&apos;t just teach skills. We build builders.<br/><br/>
            DevPhoeniX is an ecosystem designed to help you learn, build, ship, and grow in the real world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4 mb-12 w-full max-w-sm"
          >
            {whyChecklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 shadow-inner">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative w-full max-w-[320px] aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-white/80 to-white/30 backdrop-blur-2xl border border-white/60 shadow-[0_20px_50px_-10px_rgba(249,115,22,0.1)] flex items-center justify-center overflow-hidden group"
          >
            <div className="absolute inset-0 bg-orange-400/10 blur-[40px] rounded-full scale-110" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.6),transparent)]" />
            
            <motion.div 
              animate={{ y: [-8, 8, -8] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[85%] h-[85%] z-10"
            >
              <Image
                src={mascotImage}
                alt="Student Success Builder Mascot"
                fill
                sizes="(max-width: 768px) 320px, 400px"
                className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] select-none pointer-events-none"
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6 relative">
          <div className="grid sm:grid-cols-2 gap-6 relative z-10">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 + 0.2, duration: 0.6 }}
                className={`bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.15)] transition-all duration-500 flex flex-col h-full group ${idx % 2 !== 0 ? 'sm:mt-12' : ''}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-600 flex items-center justify-center shrink-0 mb-6 border border-orange-100 shadow-inner group-hover:-translate-y-1 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow text-sm">{pillar.description}</p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-bold tracking-wider uppercase text-orange-500">
                    {pillar.footerTag}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-2 border-dashed border-orange-200/50 rounded-full z-0 pointer-events-none animate-[spin_120s_linear_infinite]" />
        </div>

      </div>
    </SectionWrapper>
  );
}

