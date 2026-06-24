"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, User, Mail, Phone, BookOpen, MessageSquare, Zap } from "lucide-react";
import { usePathname } from "next/navigation";

const PROGRAMS = [
  "AI & Prompt Engineering",
  "Full Stack MERN Development",
  "Data Structures & Algorithms with Python",
  "Data Science & Machine Learning",
  "Data Analytics",
  "Cloud & DevOps Engineering",
  "Digital Marketing",
  "Advanced Excel",
  "Startup & Entrepreneurship",
  "Not decided yet"
];

const WA_NUMBER = '919734876490';

// ─── Enquiry Modal ────────────────────────────────────────────────────────────
function EnquiryModal({ onClose, defaultProgram = '' }: { onClose: () => void; defaultProgram?: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', program: defaultProgram, message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pathname = usePathname();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) e.phone = 'Valid phone required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStatus('submitting');
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source_page: pathname, source_campaign: 'floating_cta' }),
      });
      setStatus('success');
    } catch { setStatus('idle'); }
  };

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const waMsg = encodeURIComponent(`Hi DevPhoeniX Team! 👋\n\nI'm ${form.name || 'interested'} and I just submitted an inquiry${form.program ? ` for *${form.program}*` : ''}.\n\nCould you please share more details?\n\n#FollowTheRise 🔥`);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-[#0E1016] border border-slate-800 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Orange accent bar */}
        <div className="h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400" />

        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-6">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">You're In! 🔥</h3>
                <p className="text-slate-400 text-sm mb-6">Our team will reach out within 24 hours.</p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors mb-3"
                >
                  <MessageSquare className="w-4 h-4" /> Continue on WhatsApp
                </a>
                <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:bg-white/5 transition-colors">
                  Close
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    Free Counselling
                  </span>
                  <h2 className="text-2xl font-extrabold text-white">Start Your Journey</h2>
                  <p className="text-sm text-slate-400 mt-1">Expert guidance. No spam. Just results.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input value={form.name} onChange={f('name')} placeholder="Full Name"
                        className={`w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder-slate-600 ${errors.name ? 'border-red-500/50' : 'border-slate-800'}`} />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="email" value={form.email} onChange={f('email')} placeholder="Email Address"
                        className={`w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder-slate-600 ${errors.email ? 'border-red-500/50' : 'border-slate-800'}`} />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="tel" value={form.phone} onChange={f('phone')} placeholder="+91 Phone Number"
                        className={`w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder-slate-600 ${errors.phone ? 'border-red-500/50' : 'border-slate-800'}`} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input value={form.college} onChange={f('college')} placeholder="College / Organization"
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-slate-800 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder-slate-600" />
                    </div>
                  </div>

                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <select value={form.program} onChange={f('program')}
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#0E1016] border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-orange-500/50 transition-colors appearance-none">
                      <option value="">Program of interest</option>
                      {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {status === 'submitting' ? 'Submitting...' : <><Zap className="w-4 h-4" /> Get Free Counselling</>}
                  </button>

                  <p className="text-center text-xs text-slate-600">No spam. We only contact you about your inquiry.</p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Floating CTA Button ──────────────────────────────────────────────────────
export function FloatingEnquiryCTA() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();

  // Page-aware CTA label
  const ctaLabel = pathname?.startsWith('/programs/')
    ? 'Talk to Mentor'
    : pathname?.startsWith('/community')
    ? 'Join Workshop'
    : 'Enquire Now';

  useEffect(() => {
    // Hide on admin routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/admin-login')) {
      setVisible(false);
      return;
    }

    const onScroll = () => {
      // Show after scrolling 200px (past hero)
      setVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <AnimatePresence>
        {visible && !modalOpen && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setModalOpen(true)}
            className="fixed bottom-6 right-6 z-[9990] flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-[0_8px_32px_rgba(249,115,22,0.45)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.55)] hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 group"
            aria-label="Open enquiry form"
          >
            {/* Subtle ambient pulse ring */}
            <span className="absolute inset-0 rounded-full bg-orange-500 opacity-30 animate-ping" style={{ animationDuration: '3s' }} />
            <span className="relative flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {ctaLabel}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <EnquiryModal onClose={() => setModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
