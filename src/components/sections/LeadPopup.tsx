"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle, Phone, Mail, User, BookOpen, MessageSquare, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';

const PROGRAMS = [
  'Full Stack Development',
  'Cloud Computing (AWS)',
  'Data Analytics',
  'DSA (Industry Ready)',
  'AI Automation',
  'Digital Marketing',
  'Advanced Excel',
  'Entrepreneurship',
  'Not decided yet',
];

const STATUSES = ['Student', 'Working Professional', 'Freelancer', 'Business Owner', 'Other'];

const WA_NUMBER = '919876543210'; // Replace with real number

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ name: string; program: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', program: '', current_status: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pathname = usePathname();

  const triggerOpen = useCallback(() => {
    if (sessionStorage.getItem('dp-lead-dismissed')) return;
    setOpen(true);
  }, []);

  useEffect(() => {
    // Never show on admin routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/admin-login')) return;
    if (sessionStorage.getItem('dp-lead-dismissed')) return;

    let triggered = false;

    // 1. Exit intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered) { triggered = true; triggerOpen(); }
    };

    // 2. Scroll depth (70%)
    const handleScroll = () => {
      if (triggered) return;
      const scrollPct = (window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPct >= 70) { triggered = true; triggerOpen(); }
    };

    // 3. Time on page (45s — less aggressive than 30s)
    const timer = setTimeout(() => { if (!triggered) { triggered = true; triggerOpen(); } }, 45000);

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [pathname, triggerOpen]);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem('dp-lead-dismissed', '1');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) e.phone = 'Valid phone required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          current_status: form.current_status,
          currentStatus: form.current_status,
          source_page: pathname || '/',
          source_campaign: 'popup',
        }),
      });
      setSubmittedData({ name: form.name, program: form.program });
      setSubmitted(true);
      sessionStorage.setItem('dp-lead-dismissed', '1');
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
  };

  // Build WhatsApp message from submitted data
  const waMessage = submittedData ? encodeURIComponent(
    `Hi DevPhoeniX Team! 👋\n\nI'm ${submittedData.name} and I just submitted an inquiry${submittedData.program ? ` for the *${submittedData.program}* program` : ''}.\n\nCould you please help me with more details?\n\n#FollowTheRise 🔥`
  ) : '';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-[#FFF9F5] rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.25)] border border-orange-100 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-red-500" />

              {/* Background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-[80px] pointer-events-none opacity-50" />

              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative p-6 pt-5">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="mb-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                          Free Counselling
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                          Start Your Builder<br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Journey Today</span>
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                          Get expert guidance on the right program for your goals. We'll reach out within 24 hours.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input value={form.name} onChange={f('name')} placeholder="Your full name"
                              className={`w-full h-11 pl-9 pr-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${errors.name ? 'border-red-300' : 'border-slate-200'}`} />
                          </div>
                          {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
                        </div>

                        <div>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="email" value={form.email} onChange={f('email')} placeholder="Email address"
                              className={`w-full h-11 pl-9 pr-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${errors.email ? 'border-red-300' : 'border-slate-200'}`} />
                          </div>
                          {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
                        </div>

                        <div>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="tel" value={form.phone} onChange={f('phone')} placeholder="+91 phone number"
                              className={`w-full h-11 pl-9 pr-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${errors.phone ? 'border-red-300' : 'border-slate-200'}`} />
                          </div>
                          {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>}
                        </div>

                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <select value={form.program} onChange={f('program')}
                            className="w-full h-11 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition appearance-none">
                            <option value="">Program of interest</option>
                            {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>

                        <select value={form.current_status} onChange={f('current_status')}
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition appearance-none">
                          <option value="">Current status</option>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}

                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={loading}
                          className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(249,115,22,0.35)] hover:shadow-[0_12px_32px_rgba(249,115,22,0.45)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          {loading ? 'Submitting...' : (
                            <><Zap className="w-4 h-4" /> Get Free Counselling <ArrowRight className="w-4 h-4" /></>
                          )}
                        </motion.button>

                        <p className="text-center text-xs text-slate-400">No spam. We'll only contact you about your inquiry.</p>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 border border-green-100">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">You're In! 🔥</h2>
                      <p className="text-slate-500 text-sm mb-6">
                        Our team will contact you within 24 hours.{' '}
                        {submittedData?.program && <span>Get ready to explore <strong className="text-orange-600">{submittedData.program}</strong>.</span>}
                      </p>

                      {/* WhatsApp CTA */}
                      <a
                        href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors mb-3 shadow-lg shadow-green-500/20"
                      >
                        <MessageSquare className="w-5 h-5" /> Continue on WhatsApp
                      </a>
                      <button onClick={close} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
                        Continue Exploring
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
