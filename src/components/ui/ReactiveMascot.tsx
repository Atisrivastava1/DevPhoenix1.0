"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Code2, Server, Rocket, Compass, Network, CheckCircle } from "lucide-react";

interface ReactiveMascotProps {
  activeIndex: number;
  mascotImage: string;
}

export function ReactiveMascot({ activeIndex, mascotImage }: ReactiveMascotProps) {
  const getHologramIcon = () => {
    switch (activeIndex) {
      case 0: return <Compass className="w-16 h-16 text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]" strokeWidth={1.5} />;
      case 1: return <Code2 className="w-16 h-16 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" strokeWidth={1.5} />;
      case 2: return <Network className="w-16 h-16 text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" strokeWidth={1.5} />;
      case 3: return <CheckCircle className="w-16 h-16 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]" strokeWidth={1.5} />;
      case 4: default: return <Rocket className="w-16 h-16 text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.8)]" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="relative h-[300px] lg:h-[450px] w-full max-w-md mx-auto hidden md:block mt-4">
      {/* Background Cinematic Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-transparent rounded-[3rem] transform -rotate-6 scale-95 opacity-50 border border-white/50 shadow-inner" />
      
      {/* Mascot Image */}
      <Image
        src={mascotImage}
        alt="Transformation Journey"
        fill
        sizes="(max-width: 768px) 100vw, 500px"
        className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(249,115,22,0.15)] z-10 relative"
      />

      {/* Floating Hologram projecting from the laptop */}
      <div className="absolute top-[25%] right-[10%] w-[120px] h-[120px] z-20 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(8px)" }}
            animate={{ 
              opacity: 1, 
              y: [0, -10, 0], // floating animation
              scale: 1, 
              filter: "blur(0px)",
              transition: {
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 }
              }
            }}
            exit={{ opacity: 0, y: -20, scale: 1.1, filter: "blur(8px)" }}
            className="relative flex items-center justify-center"
          >
            {getHologramIcon()}
            
            {/* Hologram base projector beam effect */}
            <div className="absolute -bottom-8 w-24 h-8 bg-gradient-to-t from-white/0 to-current opacity-20 blur-md rounded-full" />
            <div className="absolute -bottom-10 w-4 h-1 bg-white/50 blur-sm rounded-full" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
