"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Quote } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { Testimonials } from "@/components/sections/Testimonials";
import { Mentors } from "@/components/sections/Mentors";
import { designSystem } from "@/lib/design-system";
import { DynamicImage } from "@/components/ui/DynamicImage";

// Dynamic Lucide helper
const renderIcon = (name: string, className: string = "w-5 h-5") => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

export default function CommunityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/community', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const payload = d && d.success && d.data ? d.data : d;
        setData(payload);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF9F5] text-slate-500 animate-pulse">
        Loading builder ecosystem...
      </div>
    );
  }

  const features = data.features || [];
  const stats = data.stats || [];
  const highlights = data.highlights || {};
  const socials = data.socials || [];

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-24 bg-[#FFF9F5]">
        
        {/* Page Hero */}
        <SectionWrapper background="cream" overflowHidden>
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-400/5 rounded-full blur-[120px] -translate-x-1/2" />
            <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[150px] translate-x-1/3" />
          </div>

          <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 items-start relative z-10">
            
            {/* LEFT COLUMN: Typography & Features */}
            <div className="lg:col-span-5 flex flex-col items-start relative pt-4">
              <motion.div
                initial={designSystem.motion.fadeInUp.initial}
                whileInView={designSystem.motion.fadeInUp.whileInView}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm mb-6"
              >
                {renderIcon("Users", "w-4 h-4 text-orange-500")}
                <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">THE ECOSYSTEM</span>
              </motion.div>

              <motion.h1
                initial={designSystem.motion.fadeInUp.initial}
                whileInView={designSystem.motion.fadeInUp.whileInView}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight"
              >
                You Don&apos;t Build Alone.<br />
                <span className={designSystem.gradients.textOrangeRed}>Grow</span> With Builders.
              </motion.h1>

              <motion.p
                initial={designSystem.motion.fadeInUp.initial}
                whileInView={designSystem.motion.fadeInUp.whileInView}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 mb-10 leading-relaxed"
              >
                Join a thriving ecosystem of builders, mentors, and creators supporting each other at every step of the journey.
              </motion.p>

              <motion.div 
                initial={designSystem.motion.fadeInUp.initial}
                whileInView={designSystem.motion.fadeInUp.whileInView}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-6 w-full"
              >
                {features.map((feat: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-orange-50/50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100/50 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                      {renderIcon(feat.icon, "w-5 h-5")}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">{feat.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* CENTER COLUMN: Main Collaborative Visual */}
            <div className="lg:col-span-4 flex justify-center w-full relative">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative w-full max-w-[400px] lg:max-w-none aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group"
              >
                <DynamicImage 
                  src="/community/community-scene.png"
                  alt="Builder Community"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  category="community"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent opacity-80 z-10" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col gap-4 z-20">
                   <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-orange-400">
                      <Quote className="w-5 h-5" fill="currentColor" />
                   </div>
                   <p className="text-white text-lg font-medium leading-relaxed drop-shadow-md">
                     &quot;Surround yourself with builders who challenge, inspire, and push you forward.
                   </p>
                   <p className="text-orange-400 font-bold drop-shadow-md">That&apos;s how you grow.&quot;</p>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Floating Ecosystem Cards */}
            <div className="lg:col-span-3 flex flex-col gap-6 relative mt-12 lg:mt-0">
              
              {/* Mentor Feedback Card */}
              {highlights.mentorFeedback && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10"
                >
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-xs font-bold text-slate-800">{highlights.mentorFeedback.title}</span>
                     <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full">{highlights.mentorFeedback.badge}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    &quot;{highlights.mentorFeedback.quote}&quot;
                  </p>
                  <div className="w-full bg-[#0D1117] rounded-xl p-3 text-[10px] font-mono overflow-hidden opacity-70">
                    <pre className="text-slate-300 whitespace-pre-wrap">{highlights.mentorFeedback.code}</pre>
                  </div>
                </motion.div>
              )}

              {/* Live Workshop Card */}
              {highlights.liveWorkshop && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden z-10"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/4" />
                  <div className="flex items-center justify-between mb-5 relative z-10">
                     <span className="text-xs font-bold text-slate-300">{highlights.liveWorkshop.title}</span>
                     <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase rounded-full border border-red-500/20">
                       <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> {highlights.liveWorkshop.badge}
                     </span>
                  </div>
                  <div className="flex items-start gap-4 mb-5 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                      {renderIcon("Video", "w-6 h-6 text-white")}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight mb-1">{highlights.liveWorkshop.topic}</h4>
                      <p className="text-[10px] text-slate-400">{highlights.liveWorkshop.time}</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-colors backdrop-blur-sm border border-white/10">
                    {highlights.liveWorkshop.btnText}
                  </button>
                </motion.div>
              )}

              {/* Streak Card */}
              {highlights.streak && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {renderIcon("Zap", "w-4 h-4 text-orange-500")}
                      <span className="text-xs font-bold text-slate-800">{highlights.streak.title}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">{highlights.streak.value}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase">{highlights.streak.unit}</span>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </SectionWrapper>

        {/* Community Stats Strip */}
        <SectionWrapper background="white" className="py-12 border-t border-slate-100">
           <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.03)] relative overflow-hidden">
             <div className="flex flex-wrap justify-between gap-8 lg:gap-4">
               {stats.map((stat: any, idx: number) => (
                 <div key={idx} className="flex-1 min-w-[140px] flex items-center gap-4 relative group">
                   {idx !== stats.length - 1 && (
                     <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 w-[1px] h-12 bg-slate-100" />
                   )}
                   <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100/50 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                     {renderIcon(stat.icon, "w-6 h-6")}
                   </div>
                   <div>
                     <span className="text-2xl font-black text-slate-900 block group-hover:text-orange-600 transition-colors">{stat.value}</span>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </SectionWrapper>

        <Mentors />
        <Testimonials />

        {/* Social Links Join CTA */}
        <SectionWrapper background="white" className="pb-32">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.15),transparent)] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 relative z-10">
              Join the DevPhoeniX Ecosystem
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg relative z-10">
              Connect with us on our social channels to get the latest updates, participate in community discussions, and stay inspired.
            </p>

            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              {socials.map((link: any, idx: number) => (
                <a 
                  key={idx} 
                  href={link.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/10 hover:bg-orange-500 border border-white/20 text-white rounded-full font-bold transition-all duration-300 backdrop-blur-md shadow-lg"
                >
                  Follow on {link.label}
                </a>
              ))}
            </div>
          </div>
        </SectionWrapper>

      </div>
      <Footer />
    </>
  );
}
