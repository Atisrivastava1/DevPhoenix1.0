"use client";

import { motion } from "framer-motion";
import { Clock, Briefcase, CheckCircle2, ChevronRight, Award, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { Testimonials } from "@/components/sections/Testimonials";
import { GlowCard } from "@/components/ui/GlowCard";
import { designSystem } from "@/lib/design-system";
import { PremiumEmptyState } from "@/components/ui/PremiumEmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";


export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/programs', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const raw = data.success && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        setPrograms(raw.map((p: any) => ({
          ...p,
          practical_hours: p.practical_hours || p.practicalHours || "100+ Hours",
          pricing_details: p.pricing_details || p.pricingDetails || {
            discountedPrice: p.discountedPrice || p.price,
            originalPrice: p.originalPrice || ""
          }
        })));
        setLoading(false);
      })
      .catch(() => {
        setPrograms([]);
        setLoading(false);
      });
  }, []);

  const premiumPrograms = programs.filter(p => p.type === 'Premium');
  const industrialPrograms = programs.filter(p => p.type === 'Industrial');

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-24 bg-[#FFF9F5]">
        
        {/* Page Hero */}
        <SectionWrapper background="cream" className="py-20 lg:py-24 border-b border-orange-100/50 relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col items-center text-center relative z-10 max-w-5xl mx-auto">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-8 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              INDUSTRY-ORIENTED LEARNING
            </motion.div>
 
            <motion.h1
              initial={designSystem.motion.fadeInUp.initial}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight"
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
              Project-first education designed for real-world execution. Build complete portfolios, earn verified certifications, and step into the industry with confidence.
            </motion.p>
 
            {/* Pricing Overview Cards */}
            <motion.div 
              initial={designSystem.motion.fadeInUp.initial}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12"
            >
              <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Premium Programs</span>
                <span className="text-3xl font-extrabold text-slate-900 mb-2">₹4999</span>
                <span className="text-sm font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full">4–6 Months Duration</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Industrial Training</span>
                <span className="text-3xl font-extrabold text-slate-900 mb-2">₹2999</span>
                <span className="text-sm font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full">2–3 Months • 30+ Hours</span>
              </div>
            </motion.div>
            
            <motion.button
              initial={designSystem.motion.fadeInUp.initial}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-lg shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-105"
            >
              Explore Programs
            </motion.button>
          </div>
        </SectionWrapper>
 
        {/* Premium Career Programs */}
        <SectionWrapper background="white" id="premium" className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Premium Career Programs
              </h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                Comprehensive 4-6 month journeys designed to take you from fundamentals to advanced, interview-ready systems builder.
              </p>
            </div>
 
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : premiumPrograms.length === 0 ? (
              <PremiumEmptyState
                title="No Premium Programs Available"
                description="Our educational engineers are currently compiling new premium career pathways. Check back soon!"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {premiumPrograms.map((prog, idx) => (
                  <GlowCard key={prog.id} glowColor="orange" customSize className="w-full">
                    <div className="flex flex-col h-full z-10 p-2">
                      
                      {/* Image Area */}
                      {prog.image && (
                        <div className="w-full h-56 rounded-2xl bg-slate-100 mb-6 overflow-hidden relative border border-slate-200">
                          <Image 
                            src={prog.image} 
                            alt={prog.title} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
                             <Award className="w-4 h-4 text-green-600" />
                             <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Certificate</span>
                          </div>
                        </div>
                      )}
 
                      {/* Meta Header */}
                      <div className="flex items-center justify-between mb-4">
                         <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-orange-100 text-orange-700">
                           Premium Program
                         </span>
                         <span className="text-lg font-extrabold text-slate-900">{prog.price}</span>
                      </div>
 
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{prog.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{prog.description}</p>
                      
                      {/* Tags */}
                      {Array.isArray(prog.tags) && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {prog.tags.map((tag: string, i: number) => (
                            <span key={i} className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
 
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                              <Clock className="w-4 h-4" />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                             <span className="text-sm font-bold text-slate-700">{prog.duration}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                              <Briefcase className="w-4 h-4" />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Practical</span>
                             <span className="text-sm font-bold text-slate-700">{prog.practical_hours}</span>
                           </div>
                        </div>
                      </div>
 
                      {Array.isArray(prog.outcomes) && (
                        <div className="mb-8">
                          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Key Outcomes</p>
                          <ul className="space-y-2">
                            {prog.outcomes.slice(0, 3).map((outcome: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm font-medium text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                {outcome}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
 
                      {/* CTA Footer */}
                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-4">
                        <button className="flex-1 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-orange-500 transition-colors shadow-sm text-center">
                          Enroll Now
                        </button>
                        <Link href={`/programs/${prog.slug || prog.id}`} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1">
                          Syllabus <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
 
                    </div>
                  </GlowCard>
                ))}
              </div>
            )}
          </div>
        </SectionWrapper>
 
        {/* Industrial Training Programs */}
        <SectionWrapper background="cream" id="industrial" className="py-20 lg:py-24 border-t border-orange-100/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Industrial Training
              </h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                Accelerated 2-3 month high-impact practical training. Build real workflows, launch MVPs, and optimize operations.
              </p>
            </div>
 
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : industrialPrograms.length === 0 ? (
              <PremiumEmptyState
                title="No Industrial Programs Available"
                description="Accelerated training batches are currently being scheduled with our corporate partners. Check back soon!"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {industrialPrograms.map((prog, idx) => (
                  <GlowCard key={prog.id} glowColor="orange" customSize className="w-full">
                    <div className="flex flex-col h-full z-10 p-2">
                      
                      {/* Image Area */}
                      {prog.image && (
                        <div className="w-full h-56 rounded-2xl bg-slate-100 mb-6 overflow-hidden relative border border-slate-200">
                          <Image 
                            src={prog.image} 
                            alt={prog.title} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
                             <Award className="w-4 h-4 text-green-600" />
                             <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Certificate</span>
                          </div>
                        </div>
                      )}
 
                      {/* Meta Header */}
                      <div className="flex items-center justify-between mb-4">
                         <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-slate-100 text-slate-700">
                           Industrial Training
                         </span>
                         <span className="text-lg font-extrabold text-slate-900">{prog.price}</span>
                      </div>
 
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{prog.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{prog.description}</p>
                      
                      {/* Tags */}
                      {Array.isArray(prog.tags) && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {prog.tags.map((tag: string, i: number) => (
                            <span key={i} className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
 
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                              <Clock className="w-4 h-4" />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                             <span className="text-sm font-bold text-slate-700">{prog.duration}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                              <Briefcase className="w-4 h-4" />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Practical</span>
                             <span className="text-sm font-bold text-slate-700">{prog.practical_hours}</span>
                           </div>
                        </div>
                      </div>
 
                      {Array.isArray(prog.outcomes) && (
                        <div className="mb-8">
                          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Key Outcomes</p>
                          <ul className="space-y-2">
                            {prog.outcomes.slice(0, 3).map((outcome: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm font-medium text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                {outcome}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
 
                      {/* CTA Footer */}
                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-4">
                        <button className="flex-1 py-3 bg-slate-950 text-white text-sm font-bold rounded-xl hover:bg-orange-500 transition-colors shadow-sm text-center">
                          Enroll Now
                        </button>
                        <Link href={`/programs/${prog.slug || prog.id}`} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1">
                          Syllabus <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
 
                    </div>
                  </GlowCard>
                ))}
              </div>
            )}
          </div>
        </SectionWrapper>
        
        {/* Testimonials Trust Layer */}
        <Testimonials />

      </div>
      <Footer />
    </>
  );
}
