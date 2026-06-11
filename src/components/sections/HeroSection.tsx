"use client";

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, Play, Users, Code, BookOpen, Trophy, Star } from "lucide-react";
import Image from "next/image";
import { designSystem } from "@/lib/design-system";
import Link from "next/link";
import { DynamicImage } from "@/components/ui/DynamicImage";

// Default/static fallbacks in case configuration is loading or missing
const FALLBACK = {
  badge: "Welcome to DevPhoenix Ecosystem",
  headline1: "Learn. Grow.",
  headline2: "Succeed.",
  subheadline: "Empowering minds with the skills, knowledge, and confidence to build a better tomorrow.",
  primaryCta: { text: "Explore Programs", href: "/programs" },
  secondaryCta: { text: "How It Works", href: "/learning-paths" },
  mascotImage: "/learning.png",
  glowColor: "orange",
  floatingCard1Title: "Your Journey",
  floatingCard1Status: "In Progress",
  floatingCard2Label: "Next Milestone",
  floatingCard2Content: "Build Your First Project",
  stats: [
    { value: "25,000+", label: "Active Learners" },
    { value: "300+", label: "Expert Courses" },
    { value: "98%", label: "Success Rate" },
    { value: "4.8/5", label: "Learner Rating" }
  ]
};

export function HeroSection() {
  const [config, setConfig] = useState<any>(null);
  const [visualBlocks, setVisualBlocks] = useState<any[]>([]);

  useEffect(() => {
    // 1. Try reading from sessionStorage first for site-config
    if (typeof window !== 'undefined') {
      const cachedConfig = sessionStorage.getItem('/api/site-config');
      if (cachedConfig) {
        try {
          const { val, expiry } = JSON.parse(cachedConfig);
          if (expiry > Date.now() && val.hero) {
            setConfig(val.hero);
          }
        } catch {}
      }
    }

    fetch('/api/site-config', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const payload = d && d.success && d.data ? d.data : (d || {});
        if (payload.hero) {
          setConfig(payload.hero);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('/api/site-config', JSON.stringify({
              val: payload,
              expiry: Date.now() + 60000 // Cache for 1 minute
            }));
          }
        }
      })
      .catch(() => {});

    // 2. Try reading from sessionStorage for visual-blocks
    if (typeof window !== 'undefined') {
      const cachedBlocks = sessionStorage.getItem('/api/visual-blocks');
      if (cachedBlocks) {
        try {
          const { val, expiry } = JSON.parse(cachedBlocks);
          if (expiry > Date.now() && Array.isArray(val)) {
            setVisualBlocks(val.filter((b: any) => b.section_key === 'hero' && b.visibility));
          }
        } catch {}
      }
    }

    fetch('/api/visual-blocks', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const list = d && d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
        setVisualBlocks(list.filter((b: any) => b.section_key === 'hero' && b.visibility));
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('/api/visual-blocks', JSON.stringify({
            val: list,
            expiry: Date.now() + 60000 // Cache for 1 minute
          }));
        }
      })
      .catch(() => {});
  }, []);

  const hero = config || FALLBACK;
  
  // Resolve dynamic visual blocks overrides
  const mascotBlock = visualBlocks.find(b => b.id === 'hero-mascot');
  const card1Block = visualBlocks.find(b => b.id === 'hero-card-1');
  const card2Block = visualBlocks.find(b => b.id === 'hero-card-2');

  const badge = hero.badge || FALLBACK.badge;
  const headline1 = hero.headline1 || FALLBACK.headline1;
  const headline2 = hero.headline2 || FALLBACK.headline2;
  const subheadline = hero.subheadline || FALLBACK.subheadline;
  const primaryCta = hero.primaryCta || FALLBACK.primaryCta;
  const secondaryCta = hero.secondaryCta || FALLBACK.secondaryCta;
  
  const mascotImage = mascotBlock?.image_url || hero.mascotImage || FALLBACK.mascotImage;
  const glowColor = hero.glowColor || FALLBACK.glowColor;
  
  const card1Title = card1Block?.title || hero.floatingCard1Title || FALLBACK.floatingCard1Title;
  const card1Status = card1Block?.subtitle || hero.floatingCard1Status || FALLBACK.floatingCard1Status;
  
  const card2Label = card2Block?.subtitle || hero.floatingCard2Label || FALLBACK.floatingCard2Label;
  const card2Content = card2Block?.title || hero.floatingCard2Content || FALLBACK.floatingCard2Content;
  
  const stats = Array.isArray(hero.stats) && hero.stats.length > 0 ? hero.stats : FALLBACK.stats;


  return (
    <div className="relative font-sans overflow-hidden min-h-screen flex flex-col justify-center pt-24 bg-gradient-to-b from-[#FFFDFB] via-[#FFF9F5] to-[#FFF6F0]">
      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f973160a_1px,transparent_1px),linear-gradient(to_bottom,#f973160a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-gradient-to-tr from-orange-400/20 to-red-400/10 blur-[120px] pointer-events-none z-0 animate-[pulse_10s_infinite_alternate]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-gradient-to-br from-red-400/10 to-purple-400/20 blur-[100px] pointer-events-none z-0 animate-[pulse_8s_infinite_alternate]" />

      <style>{`
        @keyframes hero-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes hero-spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes hero-spin-reverse {
          to { transform: rotate(-360deg); }
        }
        .animate-hero-shimmer {
          animation: hero-shimmer 2.5s infinite;
        }
        .animate-hero-spin-slow {
          animation: hero-spin-slow 25s linear infinite;
        }
        .animate-hero-spin-reverse {
          animation: hero-spin-reverse 30s linear infinite;
        }
      `}</style>

      <main className={`${designSystem.spacing.containerMaxWidth} px-8 pb-24 relative`}>
        {/* Background Decorative Elements */}
        <div className={`absolute top-1/2 right-1/4 w-[800px] h-[800px] ${glowColor === 'orange' ? 'bg-orange-200/40' : 'bg-blue-200/30'} rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none z-0`} />

        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            initial={designSystem.motion.fadeInUp.initial}
            animate={designSystem.motion.fadeInUp.whileInView}
            transition={designSystem.motion.fadeInUp.transition as any}
            className="flex flex-col items-start"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-white/70 backdrop-blur-md shadow-[0_4px_20px_rgba(249,115,22,0.04)] border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 mb-8 group cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors duration-200">{badge}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform duration-200" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-slate-900 drop-shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
              {headline1}<br />
              <span className={designSystem.gradients.textOrangeRed}>
                {headline2}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-md leading-relaxed">
              {subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href={primaryCta.href || '/programs'}>
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white font-bold rounded-full shadow-[0_10px_30px_rgba(249,115,22,0.25)] hover:shadow-[0_15px_35px_rgba(249,115,22,0.4)] flex items-center gap-2 group transition-all duration-300 cursor-pointer"
                >
                  {/* Shimmer sweep effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-hero-shimmer" />
                  <span className="relative z-10 flex items-center gap-2">
                    {primaryCta.text || 'Explore Programs'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>
              </Link>

              <Link href={secondaryCta.href || '/learning-paths'}>
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white/80 backdrop-blur-md text-slate-700 font-semibold rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-200/60 flex items-center gap-3 hover:border-orange-200 hover:text-orange-600 hover:shadow-[0_10px_25px_rgba(249,115,22,0.06)] transition-all duration-300 cursor-pointer group"
                >
                  {secondaryCta.text || 'How It Works'}
                  <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                </motion.button>
              </Link>
            </div>

            {/* Feature Badges Row */}
            <div className="flex items-center gap-8 mt-16 text-sm">
              <div className="flex items-center gap-3 group">
                <div className="p-2.5 rounded-xl bg-orange-100/50 text-orange-600 border border-orange-200/20 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Expert Instructors</p>
                  <p className="text-slate-500 text-xs">Learn from industry leaders</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3 group">
                <div className="p-2.5 rounded-xl bg-orange-100/50 text-orange-600 border border-orange-200/20 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Hands-on Learning</p>
                  <p className="text-slate-500 text-xs">Practice with real systems</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Mascot/Visuals */}
          <div className="relative h-[480px] w-full flex justify-center items-center">
            {/* Soft Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-100/40 to-transparent rounded-full blur-2xl transform scale-90 -z-10" />

            {/* Interactive Hologram Disk */}
            <div className="absolute bottom-6 w-[85%] aspect-[4/1] flex items-center justify-center pointer-events-none -z-10">
              {/* Outer Glowing Ring */}
              <div className="absolute inset-0 border-2 border-dashed border-orange-400/40 rounded-[100%] animate-hero-spin-slow opacity-60 shadow-[0_0_30px_rgba(249,115,22,0.2)]" />
              {/* Middle Solid Glow Ring */}
              <div className="absolute inset-[8%] border border-orange-500/30 rounded-[100%] shadow-[0_0_40px_rgba(249,115,22,0.3),inset_0_0_20px_rgba(249,115,22,0.15)]" />
              {/* Inner Reverse Spinning Ring */}
              <div className="absolute inset-[18%] border border-dashed border-red-500/40 rounded-[100%] animate-hero-spin-reverse opacity-75" />
              {/* Hologram Vertical Light Beam effect */}
              <div className="absolute bottom-1/2 w-4/5 h-24 bg-gradient-to-t from-orange-400/15 to-transparent rounded-[100%] blur-md transform translate-y-1/4 [clip-path:polygon(10%_0%,90%_0%,100%_100%,0%_100%)]" />
            </div>

            {/* Mascot Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 w-full h-full flex items-end justify-center pb-12"
            >
              <motion.div 
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-80 h-[450px]"
              >
                <DynamicImage 
                  src={mascotImage} 
                  alt="DevPhoeniX Student Builder" 
                  fill
                  priority
                  className="object-contain drop-shadow-[0_30px_50px_rgba(249,115,22,0.25)]"
                  category="mascot"
                />
              </motion.div>
            </motion.div>

            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, rotate: 1, zIndex: 30 }}
              className="absolute top-[20%] right-[-2%] md:right-[-6%] bg-white/50 backdrop-blur-xl p-4.5 rounded-2xl shadow-[0_20px_50px_rgba(249,115,22,0.06)] border border-white/60 flex flex-col gap-2 z-20 transition-all duration-300 select-none group"
            >
              <p className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-orange-600 transition-colors">{card1Title}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-orange-500 font-semibold">{card1Status}</span>
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </div>
              </div>
              <svg className="w-28 h-8 mt-1" viewBox="0 0 100 30" fill="none">
                <path d="M0 20 Q 20 10, 40 25 T 80 10" stroke="url(#card-gradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="80" cy="10" r="3.5" fill="#f97316" className="animate-pulse" />
                <defs>
                  <linearGradient id="card-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              whileHover={{ scale: 1.05, rotate: -1, zIndex: 30 }}
              className="absolute bottom-[22%] left-[-2%] md:left-[-4%] bg-white/50 backdrop-blur-xl p-4.5 rounded-2xl shadow-[0_20px_50px_rgba(249,115,22,0.06)] border border-white/60 flex items-center gap-3.5 z-20 transition-all duration-300 select-none group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-300">
                <Code className="w-5.5 h-5.5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-0.5">{card2Label}</p>
                <p className="text-sm font-bold text-slate-800 leading-tight" dangerouslySetInnerHTML={{ __html: card2Content.replace('\n', '<br />') }} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 md:mt-8 w-full max-w-5xl mx-auto bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(249,115,22,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/60 p-8 md:p-10 relative z-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-orange-100/40">
            {stats.slice(0, 4).map((stat: any, i: number) => {
              // Dynamically resolve matching Icon
              const getIcon = (idx: number) => {
                if (idx === 0) return <Users className="w-6.5 h-6.5" />;
                if (idx === 1) return <BookOpen className="w-6.5 h-6.5" />;
                if (idx === 2) return <Trophy className="w-6.5 h-6.5" />;
                return <Star className="w-6.5 h-6.5" />;
              };

              return (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex flex-col items-center justify-center text-center px-4 transition-all duration-300 group py-4 md:py-0"
                >
                  <div className="flex items-center gap-3.5 mb-2.5 text-orange-500 group-hover:text-red-500 transition-colors duration-300">
                    <div className="p-2 rounded-xl bg-orange-50 border border-orange-100/30 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300 shadow-sm">
                      {getIcon(i)}
                    </div>
                    <span className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors duration-300">{stat.value}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-bold tracking-wide">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
