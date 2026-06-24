"use client";

import { motion } from "framer-motion";
import { Code2, BookOpen } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { Program } from "@/types";

interface ProgramCurriculumProps {
  program: Program;
}

export function ProgramCurriculum({ program }: ProgramCurriculumProps) {
  const curriculum = program.curriculum && program.curriculum.length > 0 
    ? program.curriculum 
    : [];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Complete Program Syllabus</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A comprehensive, step-by-step curriculum fully detailed module-by-module. No hidden topics.
          </p>
        </div>

        <div className="space-y-8">
          {curriculum.map((mod, idx) => (
            <motion.div 
              key={idx}
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              transition={{ delay: (idx % 3) * 0.05 }}
              className="border border-slate-200 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{mod.title}</h3>
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {mod.week || mod.duration || `Module ${idx + 1}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Module Content - Always fully visible */}
              <div className="px-6 pb-6 pt-4">
                <ul className="grid gap-3 sm:grid-cols-2 mt-2">
                  {(mod.topics || mod.lessons || []).map((item, lIdx) => (
                    <li key={lIdx} className="flex items-start gap-2.5">
                      <BookOpen className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm font-medium leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                {mod.tools && mod.tools.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <Code2 className="w-4 h-4" /> Tools & Libraries Covered
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mod.tools.map(tool => (
                        <span key={tool} className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-semibold text-slate-600">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
