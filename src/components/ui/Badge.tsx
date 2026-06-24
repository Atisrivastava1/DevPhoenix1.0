"use client";

import { ReactNode } from "react";
import { designSystem } from "@/lib/design-system";

export type BadgeVariant = "default" | "success" | "warning" | "info" | "danger" | "purple" | "orange";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 border-slate-200 text-slate-700",
  success: "bg-green-50 border-green-200 text-green-700",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
  info: "bg-blue-50 border-blue-200 text-blue-700",
  danger: "bg-red-50 border-red-200 text-red-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
  orange: "bg-orange-50 border-orange-200 text-orange-700",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
  danger: "bg-red-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

export function Badge({ variant = "default", className = "", children }: BadgeProps) {
  const roundedClass = designSystem.borderRadius.tag;
  const variantClass = variantStyles[variant];
  const dotClass = dotStyles[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold border ${roundedClass} ${variantClass} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {children}
    </span>
  );
}
