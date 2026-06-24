"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, User, Mail, Phone, BookOpen, Target, MessageSquare } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const PRIMARY_GOALS = [
  "Master Full-Stack Web Dev",
  "Get a Job / Switch Careers",
  "Build an AI Startup",
  "Learn Data Science & ML",
  "Master DevOps & Cloud",
  "Upgrade Excel & Analytics Skills",
  "Digital Marketing & Growth Strategy",
  "Improve Coding Fundamentals",
  "Other / Custom Goals"
];

export function EnquireModal({ isOpen, onClose }: EnquireModalProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", college: "", program: "", goal: "", message: "" });
  const [error, setError] = useState("");
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const combinedMessage = `Goal: ${form.goal || "N/A"}. ${form.message || ""}`;
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          college: form.college,
          program: form.program || "Not decided yet",
          message: combinedMessage,
          source_page: pathname,
          source_campaign: "join_now_modal"
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", college: "", program: "", goal: "", message: "" });
        setTimeout(() => {
          onClose();
          setTimeout(() => setStatus("idle"), 300);
        }, 2500);
      } else {
        setError(data.message || "Failed to submit. Please try again.");
        setStatus("idle");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Start Your Journey</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-4 pb-20"
                >
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Application Received!</h3>
                  <p className="text-slate-500 max-w-[250px]">We'll be in touch with you shortly to plan your personalized learning journey.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-400" />
                      Full Name
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm text-slate-800" 
                      placeholder="John Doe" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" />
                      Email Address
                    </label>
                    <input 
                      required 
                      type="email" 
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm text-slate-800" 
                      placeholder="john@example.com" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400" />
                      Phone Number
                    </label>
                    <input 
                      required 
                      type="tel" 
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm text-slate-800" 
                      placeholder="9734876490" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      College / Organization
                    </label>
                    <input 
                      type="text" 
                      value={form.college}
                      onChange={e => setForm({ ...form, college: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm text-slate-800" 
                      placeholder="College or Organization Name" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      Program of Interest
                    </label>
                    <select 
                      required
                      value={form.program}
                      onChange={e => setForm({ ...form, program: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white shadow-sm text-slate-800"
                    >
                      <option value="">Select a Program</option>
                      {LATEST_PROGRAMS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-slate-400" />
                      Primary Goal
                    </label>
                    <select 
                      required
                      value={form.goal}
                      onChange={e => setForm({ ...form, goal: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white shadow-sm text-slate-800"
                    >
                      <option value="">Select your goal</option>
                      {PRIMARY_GOALS.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      Additional Message (Optional)
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm text-slate-800 resize-none"
                      placeholder="Any specific topics or expectations..."
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={status === "submitting"}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 text-lg cursor-pointer"
                    >
                      {status === "submitting" ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-center text-xs text-slate-400 mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
