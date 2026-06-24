"use client";

import { motion } from "framer-motion";
import { Sparkles, Rocket, ArrowRight, Code2, Bot, Users } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const CODE_LINES = [
  "// Initializing future builder",
  "const builder = new DevPhoenix.Student();",
  "",
  "builder.learn('AI & Modern Web');",
  "builder.build('Real World Systems');",
  "builder.deploy('To Production');",
  "",
  "await builder.succeed();"
];

function highlight(code: string) {
  let hl = code;
  hl = hl.replace(/\/\/.*/g, match => `<span class="text-slate-500">${match}</span>`);
  hl = hl.replace(/(const|new|await)\b/g, match => `<span class="text-pink-400">${match}</span>`);
  hl = hl.replace(/(builder|DevPhoenix)\b/g, match => `<span class="text-blue-400">${match}</span>`);
  hl = hl.replace(/('.*?')/g, match => `<span class="text-green-400">${match}</span>`);
  hl = hl.replace(/\b(learn|build|deploy|succeed)\b/g, match => `<span class="text-yellow-200">${match}</span>`);
  return hl;
}

function TypewriterCode() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex < CODE_LINES.length) {
      if (currentCharIndex < CODE_LINES[currentLineIndex].length) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setLines(prev => [...prev, CODE_LINES[currentLineIndex]]);
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 300);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentLineIndex]);

  return (
    <div className="font-mono text-sm md:text-base leading-loose">
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="text-slate-600 select-none w-6 text-right mr-4">{i + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: highlight(line) }} />
        </div>
      ))}
      {currentLineIndex < CODE_LINES.length && (
        <div className="flex">
          <span className="text-slate-600 select-none w-6 text-right mr-4">{lines.length + 1}</span>
          <span>
            <span dangerouslySetInnerHTML={{ __html: highlight(CODE_LINES[currentLineIndex].substring(0, currentCharIndex)) }} />
            <span className="animate-pulse bg-orange-500 w-2.5 h-5 inline-block ml-1 align-middle" />
          </span>
        </div>
      )}
    </div>
  );
}

const ctaTrustChips = [
  { text: "Project-First Learning", icon: <Code2 className="w-3.5 h-3.5" /> },
  { text: "AI-Native Workflows", icon: <Bot className="w-3.5 h-3.5" /> },
  { text: "Builder Community", icon: <Users className="w-3.5 h-3.5" /> },
  { text: "Real-World Systems", icon: <Rocket className="w-3.5 h-3.5" /> }
];

export function CtaSection() {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-8 pt-24 pb-12 z-10 overflow-hidden">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_70%)] pointer-events-none -translate-y-1/2 translate-x-1/4" />
        
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          <div className="p-10 lg:p-16 xl:p-20 flex flex-col justify-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-8 self-start"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-orange-600 tracking-widest uppercase">YOUR BUILD JOURNEY STARTS HERE</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight"
            >
              Don&apos;t Just Learn Technology.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 drop-shadow-sm">Build</span> With It.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg"
            >
              Go beyond passive learning. Build real-world systems, ship impactful projects, collaborate with builders, and grow into the future-ready creator you&apos;re meant to become.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-12"
            >
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group">
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Start Building
              </button>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50 transition-colors duration-300 flex items-center justify-center gap-2 group">
                WhatsApp Inquiry
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-orange-500" />
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {ctaTrustChips.map((chip, idx) => (
                <div key={idx} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-orange-500">{chip.icon}</div>
                  <span className="text-xs font-bold text-slate-700">{chip.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative min-h-[400px] lg:min-h-full bg-slate-900 overflow-hidden flex items-center justify-center p-6 md:p-8 lg:p-12">
             <Image 
               src="/cta/final-workspace.png"
               alt="Future Builder Workspace"
               fill
               sizes="(max-width: 1024px) 100vw, 50vw"
               className="object-cover opacity-20 mix-blend-overlay"
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#0f172a]/80 to-transparent" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent)]" />
             
             {/* Animated Terminal Content */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3, duration: 0.8 }}
               className="relative z-10 w-full max-w-lg bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
             >
               {/* Mac OS Window Header */}
               <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                 <div className="w-3 h-3 rounded-full bg-green-500/80" />
                 <span className="ml-2 text-xs font-mono text-slate-500">devphoenix-builder ~ bash</span>
               </div>
               
               {/* Terminal Body */}
               <div className="p-4 sm:p-6 text-slate-300">
                 <TypewriterCode />
               </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
