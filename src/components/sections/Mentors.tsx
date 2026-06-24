"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from './SectionWrapper';
import { designSystem } from '@/lib/design-system';
import { MentorCard } from '@/components/cards/MentorCard';

const mentors = [
  {
    name: "Vikram Mehta",
    role: "Senior SDE @ Amazon",
    status: "online" as const,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    tags: ["AWS", "System Design"],
    isVerified: true,
    followers: 1240,
  },
  {
    name: "Riya Sen",
    role: "Automation Lead @ StartX",
    status: "away" as const,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
    tags: ["Premium", "AI Tools"],
    isVerified: true,
    followers: 890,
  },
  {
    name: "Arjun Desai",
    role: "Data Scientist @ Quantum",
    status: "online" as const,
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop",
    tags: ["Python", "Machine Learning"],
    isVerified: true,
    followers: 3200,
  }
];

// ProfileCard has been extracted to MentorCard.

export const Mentors = ({
  autoplay = true,
}: {
  autoplay?: boolean;
}) => {
  return (
    <SectionWrapper background="white" className="!pt-2 lg:!pt-6 !pb-20 lg:!pb-24 relative overflow-hidden">
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            animation: "gridMove 20s linear infinite",
          }}
        />
      </div>
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>

      <div className="flex flex-col items-center mb-16 text-center max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
        >
          INDUSTRY EXPERTS
        </motion.div>
        <motion.h2
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={designSystem.typography.sectionTitle}
        >
          Learn from <span className={designSystem.gradients.textOrangeRed}>the Best</span>
        </motion.h2>
        <motion.p
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={designSystem.typography.body + " mt-4"}
        >
          Our mentors are active industry professionals from top tech companies. Connect, learn, and grow your network.
        </motion.p>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-6 md:gap-4 lg:gap-8 justify-items-center pb-8 md:pb-0 md:grid-cols-2 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
              className="w-full min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0"
            >
              <MentorCard mentor={mentor as any} />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
