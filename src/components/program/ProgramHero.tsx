"use client";

import { motion } from "framer-motion";
import { Clock, Star, Trophy, Users, Download, ArrowRight } from "lucide-react";
import Image from "next/image";
import { designSystem } from "@/lib/design-system";
import { Program } from "@/types";

interface ProgramHeroProps {
  program: Program;
  onScrollToCurriculum?: () => void;
  onEnroll?: () => void;
}

export function ProgramHero({ program, onScrollToCurriculum, onEnroll }: ProgramHeroProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#0A0C10]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={program.image} 
          alt={program.title}
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C10] via-[#0A0C10]/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="flex flex-col items-start">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              animate={designSystem.motion.fadeInUp.whileInView}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-semibold text-xs tracking-widest uppercase mb-6"
            >
              <Trophy className="w-3.5 h-3.5" />
              {program.type} Program
            </motion.div>

            <motion.h1 
              initial={designSystem.motion.fadeInUp.initial}
              animate={designSystem.motion.fadeInUp.whileInView}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight"
            >
              {program.title}
            </motion.h1>

            <motion.p 
              initial={designSystem.motion.fadeInUp.initial}
              animate={designSystem.motion.fadeInUp.whileInView}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed"
            >
              {program.description}
            </motion.p>

            {/* Stats */}
            <motion.div 
              initial={designSystem.motion.fadeInUp.initial}
              animate={designSystem.motion.fadeInUp.whileInView}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-white/10 w-full max-w-xl"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Duration</p>
                  <p className="text-sm font-semibold text-white">{program.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Level</p>
                  <p className="text-sm font-semibold text-white">{program.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Practical</p>
                  <p className="text-sm font-semibold text-white">{program.practical_hours || (program as any).practicalHours}</p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              initial={designSystem.motion.fadeInUp.initial}
              animate={designSystem.motion.fadeInUp.whileInView}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button 
                onClick={onEnroll}
                className="px-8 py-4 rounded-xl bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2"
              >
                Enroll Now <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onScrollToCurriculum}
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                View Curriculum <Download className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          {/* Right Column / Floating Elements could go here, or just space for the image focus */}
        </div>
      </div>
    </section>
  );
}
