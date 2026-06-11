"use client";

import { motion } from "framer-motion";
import { Play, Volume2, VolumeX, Pause } from "lucide-react";

interface SimulatorDashboardProps {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  onAutoPlay: () => void;
  isPlaying: boolean;
}

export function SimulatorDashboard({ isSoundEnabled, toggleSound, onAutoPlay, isPlaying }: SimulatorDashboardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-[0_4px_15px_rgb(0,0,0,0.04)] rounded-full p-1.5 shrink-0"
    >
      <button
        onClick={toggleSound}
        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-orange-500 transition-colors"
        title={isSoundEnabled ? "Mute Audio" : "Enable Interactive Audio"}
      >
        {isSoundEnabled ? <Volume2 className="w-5 h-5 text-orange-500" /> : <VolumeX className="w-5 h-5 opacity-50" />}
      </button>

      <div className="w-[1px] h-6 bg-slate-200" />

      <button
        onClick={onAutoPlay}
        className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
          isPlaying 
            ? "bg-orange-100 text-orange-600 border border-orange-200 shadow-inner" 
            : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Pause Journey</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Auto-Scroll</span>
          </>
        )}
      </button>
    </motion.div>
  );
}
