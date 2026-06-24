import React, { ReactNode } from "react";
import { 
  Component, 
  Send, 
  CheckCircle, 
  Repeat, 
  Download,
  TerminalSquare,
  Network,
  Rocket
} from "lucide-react";
import { cn } from "./ShineBorder";

export function TimelineContainer({ children, lineProgress = 0 }: { children: ReactNode; lineProgress?: number }) {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center gap-4 relative">
      {/* Background track line */}
      <div className="absolute left-[25px] top-4 bottom-4 w-[2px] bg-slate-100 z-0" />
      
      {/* Glowing progress line */}
      <div 
        className="absolute left-[25px] top-4 w-[2px] bg-gradient-to-b from-orange-400 to-red-500 z-0 shadow-[0_0_10px_rgba(249,115,22,0.8)] transition-all duration-300 ease-out" 
        style={{ height: `calc(${lineProgress * 100}% - 2rem)` }} 
      />
      
      {children}
    </div>
  );
}

const lucideMap: Record<string, any> = {
  Component,
  Send,
  CheckCircle,
  Repeat,
  Download,
  TerminalSquare,
  Network,
  Rocket
};

export function TimelineEvent({
  label,
  message,
  icon,
  isLast = false,
  isActive = false,
}: Event & {
  isLast?: boolean;
  isActive?: boolean;
}) {
  const Icon = lucideMap[icon.name] || Component;
  return (
    <div className={`group relative flex gap-4 border border-transparent p-2 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-2' : 'opacity-40 grayscale'}`}>
      <div className="relative py-2">
        <div
          className={cn(
            "rounded-full border bg-white p-2.5 z-10 relative transition-all duration-500 flex-shrink-0",
            isActive ? icon.borderColor : "border-slate-200 bg-slate-50",
            isActive ? "scale-110 shadow-[0_0_20px_rgba(249,115,22,0.4)]" : "scale-100"
          )}
        >
          <Icon className={cn("h-4 w-4 transition-colors duration-500", isActive ? icon.textColor : "text-slate-400")} />
        </div>
      </div>
      <div className="mt-1 flex flex-1 flex-col gap-1.5 pt-3">
        <div className="flex items-center justify-between gap-4">
          <p className={`text-base font-bold transition-colors duration-500 ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{label}</p>
        </div>
        <p className={`text-sm font-medium leading-relaxed transition-colors duration-500 ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>{message}</p>
      </div>
    </div>
  );
}

export function Timeline({ events = defaultTimeline, activeIndex = -1, lineProgress = 0 }: { events?: Event[], activeIndex?: number, lineProgress?: number }) {
  return (
    <div className="w-full">
      <TimelineContainer lineProgress={lineProgress}>
        {events.map((event, i) => (
          <TimelineEvent
            key={event.message}
            isLast={i === events.length - 1}
            isActive={i <= activeIndex}
            {...event}
          />
        ))}
      </TimelineContainer>
    </div>
  );
}

export interface Event {
  label: string;
  message: string;
  icon: {
    name: string;
    textColor: string;
    borderColor: string;
  };
}

export const defaultTimeline = [
  {
    label: "Choose Your Design",
    message: "Browse and select a design that fits your needs.",
    icon: {
      name: "Component",
      textColor: "text-orange-500",
      borderColor: "border-orange-500/40 bg-orange-50",
    },
  },
] satisfies Event[];
