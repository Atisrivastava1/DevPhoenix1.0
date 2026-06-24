import React from "react";
import { designSystem } from "@/lib/design-system";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "white" | "cream" | "dark";
  overflowHidden?: boolean;
}

export function SectionWrapper({ 
  children, 
  className = "", 
  id, 
  background = "white",
  overflowHidden = false
}: SectionWrapperProps) {
  
  const bgClass = {
    white: "bg-white",
    cream: "bg-[#FFF9F5]",
    dark: "bg-slate-900"
  }[background];

  return (
    <section 
      id={id}
      className={`relative w-full ${designSystem.spacing.sectionPadding} ${bgClass} ${overflowHidden ? 'overflow-hidden' : ''} ${className} z-10`}
    >
      <div className={`${designSystem.spacing.containerMaxWidth} relative z-10`}>
        {children}
      </div>
    </section>
  );
}
