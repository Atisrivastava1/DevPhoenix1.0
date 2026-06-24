"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Shield, MessageSquare } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { Program } from "@/types";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

const WA_NUMBER = '919734876490';

interface ProgramPricingProps {
  program: Program;
}

export function ProgramPricing({ program }: ProgramPricingProps) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const TARGET_DATE = new Date("2026-07-02T23:59:00+05:30").getTime();
    if (Date.now() >= TARGET_DATE) {
      setExpired(true);
    }
  }, []);

  const pd = program.pricing_details || program.pricingDetails;
 
  const included = pd?.includes && pd.includes.length > 0 ? pd.includes : [
    "Complete Curriculum Access",
    "Live Mentor Q&A Sessions",
    "Code Reviews & Project Feedback",
    "Private Discord Community",
    "Career Preparation & Resume Guide",
    "Certificate of Completion",
  ];

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
                  { value: "30–40 Hrs", label: 'Practical Training' },
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
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                Limited Seats
              </div>

              <div className="mb-6">
                <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs mb-3">Industrial Training Program</p>
                <div className="flex items-end gap-3 mb-1">
                  {expired ? (
                    <span className="text-5xl md:text-6xl font-extrabold text-slate-900">₹6,999</span>
                  ) : (
                    <span className="text-5xl md:text-6xl font-extrabold text-slate-900">₹1,249</span>
                  )}
                </div>
                {!expired && (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-slate-400 line-through text-lg font-medium">₹6,999</span>
                    <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                      You save ₹5,750
                    </span>
                  </div>
                )}
                
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <CountdownTimer onExpire={() => setExpired(true)} />
                </div>
              </div>

              <button
                onClick={scrollToForm}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-orange-500 transition-all duration-200 shadow-lg hover:shadow-orange-500/25 mb-3"
              >
                Enroll Now
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
                <Shield className="w-3.5 h-3.5" /> Secure enrollment. We respect your privacy.
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
