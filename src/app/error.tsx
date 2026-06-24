"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js Error Boundary caught an exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-2xl text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-red-500/5 pointer-events-none" />

        <div className="w-20 h-20 bg-rose-50 rounded-[1.5rem] flex items-center justify-center text-rose-500 mx-auto mb-6 border border-rose-100 shadow-inner">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          System Interruption
        </h1>
        
        <p className="text-slate-500 text-sm md:text-base mb-8 leading-relaxed">
          An unexpected error occurred during page compilation. Our engineering team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/20 text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
