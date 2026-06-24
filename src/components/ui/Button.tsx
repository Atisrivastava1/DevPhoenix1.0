"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { designSystem } from "@/lib/design-system";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-[0_10px_25px_rgba(249,115,22,0.3)] border border-transparent",
  secondary: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
  outline: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent",
  danger: "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-[0_10px_25px_rgba(244,63,94,0.3)] border border-transparent",
  whatsapp: "bg-green-500 text-white hover:bg-green-600 hover:shadow-[0_10px_25px_rgba(34,197,94,0.3)] border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-bold transition-all select-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const sizeClass = sizeStyles[size];
  const variantClass = variantStyles[variant];
  const roundedClass = designSystem.borderRadius.button;

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
      {!loading && icon && iconPosition === "left" && <span className="mr-2 shrink-0">{icon}</span>}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && <span className="ml-2 shrink-0">{icon}</span>}
    </>
  );

  const { onDrag, onDragStart, onDragEnd, ...rest } = props as any;

  return (
    <motion.button
      whileHover={disabled || loading ? undefined : { y: -2, scale: 1.01 }}
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`${baseClasses} ${sizeClass} ${variantClass} ${roundedClass} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </motion.button>
  );
}
