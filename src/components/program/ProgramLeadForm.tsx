"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, MessageSquare, Phone, Mail, User, BookOpen } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { Program } from "@/types";
import { usePathname } from "next/navigation";

const WA_NUMBER = '919734876490';

interface ProgramLeadFormProps {
  program: Program;
}

export function ProgramLeadForm({ program }: ProgramLeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', message: '' });
  const pathname = usePathname();

  const waMessage = encodeURIComponent(
    `Hi DevPhoeniX Team! 👋\n\nI'm interested in the *${program.title}* program.\n\nI'd love to know more about the curriculum, schedule, and enrollment process.\n\n#FollowTheRise 🔥`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          program: program.title,
          source_page: pathname || `/programs/${program.slug}`,
          source_campaign: 'program_page',
        }),
      });
      setStatus('success');
    } catch {
      setStatus('idle');
    }
  };

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <section id="program-lead-form" className="py-24 bg-[#0A0C10] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <motion.div
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          className="bg-[#151821] border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Request Received! 🔥</h3>
              <p className="text-slate-400 mb-8">Our admissions team will reach out within 24 hours to walk you through the program.</p>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-colors shadow-lg shadow-green-500/20 mb-3"
              >
                <MessageSquare className="w-5 h-5" />
                Chat on WhatsApp Now
              </a>
              <p className="text-xs text-slate-600">Get instant answers from our team on WhatsApp</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-white mb-3">Start Your Journey</h2>
                <p className="text-slate-400">
                  Request the detailed syllabus and speak with an admissions counselor about{' '}
                  <span className="text-orange-400 font-semibold">{program.title}</span>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="text" value={form.name} onChange={f('name')} placeholder="Full Name"
                      className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="email" value={form.email} onChange={f('email')} placeholder="Email Address"
                      className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="tel" value={form.phone} onChange={f('phone')} placeholder="+91 Phone Number"
                      className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={form.college} onChange={f('college')} placeholder="College / Organization"
                      className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                </div>

                <textarea value={form.message} onChange={f('message')} placeholder="Any specific questions? (Optional)"
                  rows={3}
                  className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none" />

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {status === 'submitting' ? 'Submitting...' : (
                    <><Send className="w-5 h-5" /> Request Syllabus & Apply</>
                  )}
                </button>

                {/* WhatsApp alternative */}
                <div className="text-center">
                  <p className="text-slate-600 text-sm mb-3">Or reach out directly</p>
                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-green-500/30 bg-green-500/5 text-green-400 text-sm font-bold hover:bg-green-500/10 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" /> Ask on WhatsApp
                  </a>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
