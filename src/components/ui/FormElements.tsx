"use client";

import React, { ReactNode } from "react";
import { designSystem } from "@/lib/design-system";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, required, error, children, className = "" }: FormFieldProps) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className={`${designSystem.typography.label} mb-1.5 flex items-center`}>
        <span>{label}</span>
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-rose-500 font-semibold mt-1 animate-pulse">{error}</span>}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-11 px-4 bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent transition-all duration-200 ${designSystem.borderRadius.lg} ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent transition-all duration-200 resize-none ${designSystem.borderRadius.lg} ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full h-11 px-4 bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent transition-all duration-200 appearance-none ${designSystem.borderRadius.lg} ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
