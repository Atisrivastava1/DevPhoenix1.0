"use client";

import { useEffect, useState } from "react";
import { MessageSquare, ChevronRight } from "lucide-react";
import { Program } from "@/types";

const WA_NUMBER = '919734876490';

interface ProgramStickyCTAProps {
  program: Program;
}

/**
 * Sticky bottom CTA bar — visible on mobile after scrolling 400px.
 * Hides when the user reaches the lead form section.
 */
export function ProgramStickyCTA({ program }: ProgramStickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const form = document.getElementById('program-lead-form');
      const formTop = form ? form.getBoundingClientRect().top + window.scrollY - 200 : Infinity;
      setVisible(scrollY > 400 && scrollY < formTop);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToForm = () => {
    document.getElementById('program-lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const waMsg = encodeURIComponent(
    `Hi DevPhoeniX! 👋\n\nI'm interested in the *${program.title}* program.\n\nCould you share details about enrollment?\n\n#FollowTheRise 🔥`
  );

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-in slide-in-from-bottom duration-300">
      {/* Safe area / gradient fade */}
      <div className="bg-gradient-to-t from-white via-white/90 to-transparent h-4" />
      <div className="bg-white border-t border-slate-200 px-4 pt-3 pb-safe pb-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        {/* Price row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 font-medium">{program.title}</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-900">
                {(program.pricing_details || program.pricingDetails)?.discountedPrice || program.price}
              </span>
              {(program.pricing_details || program.pricingDetails)?.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {(program.pricing_details || program.pricingDetails)?.originalPrice}
                </span>
              )}
            </div>
          </div>
          {(program.pricing_details || program.pricingDetails)?.emi && (
            <span className="text-xs bg-green-50 text-green-700 border border-green-200 font-semibold px-2 py-1 rounded-full">
              EMI {(program.pricing_details || program.pricingDetails)?.emi}
            </span>
          )}
        </div>

        {/* CTA buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={scrollToForm}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-orange-500 transition-colors"
          >
            Apply Now <ChevronRight className="w-4 h-4" />
          </button>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
