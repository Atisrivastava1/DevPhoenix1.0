"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Rocket, ExternalLink, Code2 } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { designSystem } from "@/lib/design-system";
import { DynamicImage } from "@/components/ui/DynamicImage";

export default function ShowcasePage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/showcase', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const list = d && d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
        if (list.length > 0) {
          setProjects(list);
        }
      })
      .catch(() => setProjects([]));
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-24 bg-[#FFF9F5]">
        
        {/* Page Hero */}
        <SectionWrapper background="cream">
          <div className="flex flex-col items-center text-center mb-16 relative">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm mb-6"
            >
              <Rocket className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">
                PROOF OF EXECUTION
              </span>
            </motion.div>
            
            <motion.h1
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight"
            >
              Real Projects. <span className={designSystem.gradients.textOrangeRed}>Real Impact.</span>
            </motion.h1>
            
            <motion.p
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Explore portfolio-ready systems, SaaS products, AI workflows, and dashboards built by DevPhoeniX learners.
            </motion.p>
          </div>
        </SectionWrapper>

        {/* Projects Grid */}
        <SectionWrapper background="white" className="pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-all duration-500 group flex flex-col"
              >
                {/* Image Header */}
                <div className="relative h-[300px] sm:h-[350px] w-full bg-slate-50 overflow-hidden border-b border-slate-100">
                   <DynamicImage 
                     src={project.image}
                     alt={project.title}
                     fill
                     sizes="(max-width: 768px) 100vw, 50vw"
                     className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                     category={project.category}
                   />
                   {/* Overlay Tags */}
                   <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 font-bold text-xs uppercase tracking-wider rounded-full shadow-sm">
                        {project.category}
                      </span>
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer shadow-sm">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                   </div>
                </div>
                
                {/* Content */}
                <div className="p-8 flex flex-col flex-grow relative">
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {project.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Impact Metric</p>
                       <p className="text-sm font-bold text-slate-800">{project.metrics || 'Highly optimized'}</p>
                     </div>
                     <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
                       <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1">Tech Stack</p>
                       <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                         <Code2 className="w-3.5 h-3.5 text-orange-500" />
                         {Array.isArray(project.tools) ? project.tools.join(", ") : project.tags?.join(", ") || "Next.js, Tailwind"}
                       </p>
                     </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Key Features Built</p>
                    <div className="space-y-2">
                      {(Array.isArray(project.features) ? project.features : []).map((feature: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-3">
                           <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                           <span className="text-sm font-semibold text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {projects.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-500 bg-slate-50 rounded-[2rem] border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Projects coming soon</h3>
                <p>We are currently gathering the latest projects from our learners.</p>
              </div>
            )}
          </div>
        </SectionWrapper>
      </div>
      <Footer />
    </>
  );
}
