"use client";

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Mentors } from "@/components/sections/Mentors";
import { CtaSection } from "@/components/sections/CtaSection";

export default function MentorsPage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-24 bg-[#FFF9F5]">
        
        {/* Animated grid background */}
        <style>
            {`
                @keyframes animate-grid {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }
                .animated-grid {
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    background-image: 
                        linear-gradient(to right, #f97316 1px, transparent 1px), 
                        linear-gradient(to bottom, #f97316 1px, transparent 1px);
                    background-size: 4rem 4rem;
                    animation: animate-grid 60s linear infinite alternate;
                    opacity: 0.03;
                    z-index: 0;
                    pointer-events: none;
                }
            `}
        </style>
        <div className="animated-grid left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 py-12">
           <Mentors autoplay={false} />
        </div>
        
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}
