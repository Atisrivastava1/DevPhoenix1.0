"use client";

import { motion } from "framer-motion";
import { designSystem } from "@/lib/design-system";
import { Program } from "@/types";
import { CheckCircle2, LayoutTemplate } from "lucide-react";

interface ProgramOverviewProps {
  program: Program;
}

export function ProgramOverview({ program }: ProgramOverviewProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Program Overview</h2>
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed mb-12">
                {program.overview ? (
                  <p>{program.overview}</p>
                ) : (
                  <p>
                    This intensive program is designed to transform you into an industry-ready professional. 
                    You'll build a portfolio of production-grade applications, mastering the ecosystem top startups use to scale.
                  </p>
                )}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-6">Key Outcomes</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {program.outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-6 h-6 text-orange-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{outcome}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/20"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-orange-500" /> Technologies
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {(program.tools || program.tags).map((tag, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 mb-6">
                <p className="text-sm font-semibold text-orange-800 uppercase tracking-wider mb-1">Tuition Fee</p>
                <p className="text-3xl font-extrabold text-slate-900">{program.price}</p>
              </div>

              <button className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-orange-500 transition-colors">
                Apply for Admission
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
