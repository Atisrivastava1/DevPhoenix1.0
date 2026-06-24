"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { Program } from "@/types";

interface ProgramFAQProps {
  program: Program;
}

export function ProgramFAQ({ program }: ProgramFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = program.faqs && program.faqs.length > 0 ? program.faqs : [
    {
      question: "Do I need prior coding experience?",
      answer: "While basic programming knowledge is helpful, our program is designed to take you from fundamentals to advanced concepts. Absolute beginners can succeed with dedication."
    },
    {
      question: "Are the live sessions recorded?",
      answer: "Yes, all live sessions and mentor interactions are recorded and made available on the dashboard within 24 hours for you to review."
    },
    {
      question: "What kind of projects will I build?",
      answer: "You will build 3-5 production-grade applications including an e-commerce backend, a real-time chat application, and a full-stack SaaS platform."
    },
    {
      question: "Is there placement assistance?",
      answer: "Yes! We provide resume reviews, mock interviews with industry experts, and direct referrals to our hiring partners upon successful graduation."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-600">Everything you need to know about the program and enrollment.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`border rounded-xl overflow-hidden transition-colors ${openIdx === idx ? 'border-orange-500 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none bg-white"
              >
                <span className={`font-bold text-lg ${openIdx === idx ? 'text-orange-600' : 'text-slate-900'}`}>
                  {faq.question}
                </span>
                <span className="ml-4 shrink-0">
                  {openIdx === idx ? (
                    <Minus className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-400" />
                  )}
                </span>
              </button>
              
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-50"
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
