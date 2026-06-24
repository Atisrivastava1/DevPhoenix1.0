"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { designSystem } from "@/lib/design-system";

interface SectionHeadingProps {
  badgeText?: string;
  badgeIcon?: LucideIcon;
  title: string;
  highlightedText?: string;
  subtitle?: string;
  alignment?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  badgeText,
  badgeIcon: BadgeIcon,
  title,
  highlightedText,
  subtitle,
  alignment = "center",
  className = "",
}: SectionHeadingProps) {
  const isCenter = alignment === "center";
  const alignClass = isCenter ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div className={`flex flex-col max-w-4xl mb-12 lg:mb-16 relative z-10 ${alignClass} ${className}`}>
      {/* Dynamic tagline badge with framer motion reveal animation */}
      {badgeText && (
        <motion.div
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={designSystem.motion.fadeInUp.viewport}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
        >
          {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
          {badgeText}
        </motion.div>
      )}

      {/* Main title with optional gradient text highlight */}
      <motion.h2
        initial={designSystem.motion.fadeInUp.initial}
        whileInView={designSystem.motion.fadeInUp.whileInView}
        viewport={designSystem.motion.fadeInUp.viewport}
        transition={{ delay: 0.1, duration: 0.5 }}
        className={`${designSystem.typography.sectionTitle} text-slate-900 mb-6`}
      >
        {title}{" "}
        {highlightedText && (
          <span className={designSystem.gradients.textOrangeRed}>
            {highlightedText}
          </span>
        )}
      </motion.h2>

      {/* Standardized subtitle paragraph */}
      {subtitle && (
        <motion.p
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={designSystem.motion.fadeInUp.viewport}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`${designSystem.typography.sectionSubtitle} ${isCenter ? "mx-auto" : ""}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
