"use client";

import { motion, useInView } from "framer-motion";
import { MapPin, Users, Laptop, Globe } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { designSystem } from "@/lib/design-system";

// ─── Simple scroll-triggered count-up component ──────────────────────────────
function CountUp({ to, duration = 1.2, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = to;
    const totalFrames = 60;
    const frameDuration = (duration * 1000) / totalFrames;
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // easeOutQuad easing function
      const currentCount = Math.round(end * (progress * (2 - progress)));
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(end);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [isInView, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function GlobalReach() {
  const cards = [
    {
      value: 15,
      suffix: "+",
      title: "Cities Reached",
      description: "Helping learners across multiple cities through live industry-focused training.",
      icon: <MapPin className="w-6 h-6 text-orange-500" />,
      delay: 0.1
    },
    {
      value: 100,
      suffix: "+",
      title: "Active Learners",
      description: "Students and professionals actively building practical skills.",
      icon: <Users className="w-6 h-6 text-orange-500" />,
      delay: 0.2
    },
    {
      value: 100,
      suffix: "%",
      title: "Online Learning",
      description: "Flexible live training accessible from anywhere.",
      icon: <Laptop className="w-6 h-6 text-orange-500" />,
      delay: 0.3
    }
  ];

  return (
    <SectionWrapper background="white" id="global-reach" className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-4 shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            Global Reach & Impact
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Our Builders Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Everywhere</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base max-w-xl"
          >
            DevPhoeniX alumni ship real code, launch startup models, and lead technical development across regions.
          </motion.p>
        </div>

        {/* 3 Premium cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay, duration: 0.6 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.06)] hover:border-orange-100 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Corner accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors duration-300" />
              
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100 mb-6 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>

              {/* Stat Value */}
              <div className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 flex items-baseline gap-0.5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 font-extrabold tracking-tight">
                  <CountUp to={card.value} suffix={card.suffix} />
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-800 mb-3">{card.title}</h3>

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
