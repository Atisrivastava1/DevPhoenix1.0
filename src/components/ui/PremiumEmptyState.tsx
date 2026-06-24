"use client";

import { motion } from "framer-motion";
import { LucideIcon, Inbox } from "lucide-react";
import { designSystem } from "@/lib/design-system";

interface PremiumEmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function PremiumEmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: PremiumEmptyStateProps) {
  return (
    <motion.div
      initial={designSystem.motion.fadeInUp.initial}
      animate={{ opacity: 1, y: 0 }}
      transition={designSystem.motion.fadeInUp.transition as any}
      className="flex flex-col items-center text-center p-8 md:p-12 bg-white rounded-[2rem] border border-orange-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-lg mx-auto my-8 relative overflow-hidden"
    >
      {/* Soft orange decorative blur circle */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Branded Icon Container */}
      <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100/50 mb-6 text-orange-500 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mb-8">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
