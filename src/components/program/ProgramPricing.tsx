"use client";

import { motion } from "framer-motion";
import { Check, Shield, Zap, MessageSquare } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { Program } from "@/types";

const WA_NUMBER = '919734876490';

interface ProgramPricingProps {
  program: Program;
}

export function ProgramPricing({ program }: ProgramPricingProps) {
  const pd = program.pricing_details || program.pricingDetails;
 
  // What's included — from pricingDetails.includes if available, else sensible defaults
  const included = pd?.includes && pd.includes.length > 0 ? pd.includes : [
    "Complete Curriculum Access",
    "Live Mentor Sessions",
    "Code Reviews & Project Feedback",
    "Private Discord Community",
    "Career Guidance & Resume Review",
    "Certificate of Completion",
  ];

  const displayPrice = pd?.discountedPrice || program.price;
  const originalPrice = pd?.originalPrice;
  const emi = pd?.emi;

  const waMsg = encodeURIComponent(
    `Hi DevPhoeniX Team! 👋\n\nI'm interested in enrolling in the *${program.title}* program.\n\nCould you please share enrollment details and any ongoing offers?\n\n#FollowTheRise 🔥`
  );

  const scrollToForm = () => {
    document.getElementById('program-lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="program-pricing" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — What's included */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">What's Included</h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Everything you need to go from learner to industry-ready builder. No hidden fees.
              </p>

              <ul className="space-y-3 mb-8">
                {included.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: program.practical_hours || (program as any).practicalHours, label: 'Practical Hours' },
                  { value: `${program.projects}+`, label: 'Live Projects' },
                  { value: '100%', label: 'Job Support' },
                ].map(stat => (
                  <div key={stat.label} className="text-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-2xl font-extrabold text-orange-500">{stat.value}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Pricing card */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-slate-100 relative overflow-hidden"
            >
              {/* "Limited Seats" ribbon */}
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                Limited Seats
              </div>

              <div className="mb-6">
                <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs mb-3">Program Fee</p>
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-5xl md:text-6xl font-extrabold text-slate-900">{displayPrice}</span>
                </div>
                {originalPrice && (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-slate-400 line-through text-lg font-medium">{originalPrice}</span>
                    <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                      You save {/* compute discount label safely */}
                      {(() => {
                        try {
                          const orig = parseInt(String(originalPrice).replace(/\D/g, '')) || 0;
                          const disp = parseInt(String(displayPrice).replace(/\D/g, '')) || 0;
                          if (orig > disp) return `₹${(orig - disp).toLocaleString('en-IN')}`;
                        } catch {}
                        return '';
                      })()}
                    </span>
                  </div>
                )}
                {emi && (
                  <p className="text-slate-500 text-sm mt-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-orange-400" />
                    EMI available from <strong className="text-slate-700">{emi}</strong>
                  </p>
                )}
              </div>

              <button
                onClick={scrollToForm}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-orange-500 transition-all duration-200 shadow-lg hover:shadow-orange-500/25 mb-3"
              >
                Apply for Admission
              </button>

              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors mb-5"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </a>

              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                <Shield className="w-3.5 h-3.5" /> No spam. We respect your privacy.
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
