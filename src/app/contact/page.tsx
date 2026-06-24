"use client";

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/sections/Footer';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { designSystem } from '@/lib/design-system';

const LATEST_PROGRAMS = [
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

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', program: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          college: form.college,
          program: form.program || 'General Contact Inquiry',
          message: form.message,
          source_page: '/contact',
          source_campaign: 'contact_page'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', college: '', program: '', message: '' });
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-24 bg-[#FFF9F5]">
        <SectionWrapper background="cream" className="pb-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              GET IN TOUCH
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight"
            >
              Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Phoenix-Grade</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 max-w-2xl"
            >
              Have questions about our programs, curriculum, or corporate training? Reach out and we'll reply within 24 hours.
            </motion.p>
          </div>
        </SectionWrapper>

        <SectionWrapper background="white" className="!pt-6 pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-8">
                <h3 className="text-2xl font-bold text-slate-900">Direct Contacts</h3>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100 text-orange-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Email Us</p>
                    <a href="mailto:contact@devphoenix.com" className="text-lg font-bold text-slate-800 hover:text-orange-500 transition-colors">
                      contact@devphoenix.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100 text-orange-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Call/WhatsApp</p>
                    <a href="tel:+919734876490" className="text-lg font-bold text-slate-800 hover:text-orange-500 transition-colors">
                      +91 9734876490
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100 text-orange-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-lg font-bold text-slate-800">
                      Kolkata, West Bengal, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Widget */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-900">Direct WhatsApp</h4>
                </div>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Prefer instant chat? Skip the email form and text us directly on WhatsApp for real-time counseling and support.
                </p>
                <a 
                  href="https://wa.me/919734876490?text=Hi%20DevPhoeniX%21%20I%20want%20to%20enquire%20about%20your%20industrial%20training%20programs."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all duration-200"
                >
                  Message +91 9734876490
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-7 bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] rounded-3xl p-8 lg:p-10">
              {success ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-orange-50 border border-orange-200 rounded-full flex items-center justify-center mx-auto text-orange-600">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Inquiry Received!</h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Thanks for reaching out! Our program advisors will contact you shortly via email or phone.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full text-sm transition-colors mt-6"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Send an Inquiry</h3>
                  
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-slate-800 bg-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-slate-800 bg-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-slate-800 bg-white"
                        placeholder="9734876490"
                      />
                    </div>
                    <div>
                      <label htmlFor="college" className="block text-sm font-bold text-slate-700 mb-2">College / Organization</label>
                      <input
                        type="text"
                        id="college"
                        value={form.college}
                        onChange={e => setForm({ ...form, college: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-slate-800 bg-white"
                        placeholder="e.g. IIT Bombay / Google"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="program" className="block text-sm font-bold text-slate-700 mb-2">Program of Interest</label>
                    <select
                      id="program"
                      required
                      value={form.program}
                      onChange={e => setForm({ ...form, program: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-slate-800 bg-white"
                    >
                      <option value="">Select a Program</option>
                      {LATEST_PROGRAMS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Your Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none text-slate-800 bg-white"
                      placeholder="Tell us about your learning goals..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all duration-200 shadow-md shadow-orange-500/10 cursor-pointer disabled:opacity-70"
                  >
                    {loading ? 'Sending...' : 'Submit Message'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </SectionWrapper>
      </div>
      <Footer />
    </>
  );
}
