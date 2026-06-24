"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Clock, Calendar, CheckSquare } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { Program } from '@/types';
import { CountdownTimer } from '@/components/ui/CountdownTimer';

interface ProgramCardProps {
  program: Program;
  ctaText?: string;
}

export function ProgramCard({ program, ctaText }: ProgramCardProps) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const TARGET_DATE = new Date("2026-07-02T23:59:00+05:30").getTime();
    if (Date.now() >= TARGET_DATE) {
      setExpired(true);
    }
  }, []);

  return (
    <GlowCard glowColor="orange" customSize className="w-full h-full flex flex-col p-2 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* Image Area */}
      <div className="w-full h-48 rounded-xl bg-slate-100 mb-6 overflow-hidden relative border border-slate-200">
        <Image 
          src={program.image} 
          alt={program.title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
           <Award className="w-3 h-3 text-green-600" />
           <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wide">Certificate</span>
        </div>
      </div>

      <div className="px-2 flex-grow flex flex-col">
        {/* Meta Header & Pricing */}
        <div className="flex items-center justify-between mb-4">
           <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full bg-orange-100 text-orange-700`}>
             Industrial Training
           </span>
           <div className="flex items-center gap-2">
             {expired ? (
               <span className="text-lg font-extrabold text-slate-900">₹6,999</span>
             ) : (
               <>
                 <span className="text-slate-400 line-through text-xs font-semibold">₹6,999</span>
                 <span className="text-lg font-extrabold text-slate-900">₹1,249</span>
               </>
             )}
           </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-1">{program.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{program.description}</p>
        
        {/* Core Stats */}
        <div className="grid grid-cols-1 gap-2.5 mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
             <Clock className="w-3.5 h-3.5 text-slate-400" />
             <span className="text-xs font-semibold text-slate-700">Duration: 30–40 Hours</span>
          </div>
          <div className="flex items-center gap-2">
             <Calendar className="w-3.5 h-3.5 text-slate-400" />
             <span className="text-xs font-semibold text-slate-700">Schedule: 2–3 Days Per Week</span>
          </div>
          <div className="flex items-center gap-2">
             <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
             <span className="text-xs font-semibold text-slate-700">Mode: Hands-On / Instructor Led</span>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="mb-5">
          <CountdownTimer onExpire={() => setExpired(true)} />
        </div>

        <Link 
          href={`/programs/${program.slug || program.id}`} 
          className="w-full py-3 bg-slate-900 text-white hover:bg-orange-500 text-center text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1 mt-auto shadow-sm"
        >
          {ctaText || "View Curriculum"}
        </Link>
      </div>
    </GlowCard>
  );
}
