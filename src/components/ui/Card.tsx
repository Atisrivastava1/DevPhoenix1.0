"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { designSystem } from "@/lib/design-system";

export type CardVariant = "default" | "glass" | "glow" | "dark";

interface CardProps {
  variant?: CardVariant;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]",
  glass: "bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.03)]",
  glow: "bg-white border border-orange-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)]",
  dark: "bg-gradient-to-r from-slate-900 to-[#0B1120] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.4)]",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6 md:p-8",
  lg: "p-8 md:p-12",
};

export function Card({
  variant = "default",
  interactive = false,
  padding = "md",
  className = "",
  onClick,
  children,
}: CardProps) {
  const roundedClass = designSystem.borderRadius.card;
  const variantClass = variantStyles[variant];
  const paddingClass = paddingStyles[padding];

  const motionProps: any = interactive && !onClick
    ? {
        whileHover: { y: -6, boxShadow: "0 25px 50px -12px rgba(249,115,22,0.08)" },
        transition: { duration: 0.3, ease: "easeOut" as const }
      }
    : onClick
    ? {
        whileHover: { y: -4, scale: 1.01 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2, ease: "easeOut" as const }
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      onClick={onClick}
      className={`relative overflow-hidden ${roundedClass} ${variantClass} ${paddingClass} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {/* Decorative backdrop gradients for premium glow card variant */}
      {variant === "glow" && (
        <>
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
        </>
      )}
      {children}
    </motion.div>
  );
}
