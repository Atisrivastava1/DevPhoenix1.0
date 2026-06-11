"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { designSystem } from "@/lib/design-system";
import { SectionWrapper } from "./SectionWrapper";
import { TestimonialCard } from "@/components/cards/TestimonialCard";


export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: any[];
  duration?: number;
  reverse?: boolean;
}) => {
  return (
    <div className={`overflow-hidden h-full ${props.className || ''}`}>
      <motion.div
        animate={{
          translateY: props.reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: props.duration || 20,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map((test, i) => (
                <TestimonialCard key={`${index}-${i}`} testimonial={test} className="mb-6 max-w-sm" />
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/testimonials', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const list = d && d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
        setTestimonials(list);
      })
      .catch(() => setTestimonials([]));
  }, []);

  if (testimonials.length === 0) return null;

  const column1 = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const column2 = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <SectionWrapper background="cream" className="border-t border-slate-100 overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

        {/* Content Side */}
        <div className="flex flex-col items-start relative z-10">
          <motion.div
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            STUDENT OUTCOMES
          </motion.div>

          <motion.h2
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={designSystem.typography.sectionTitle + " mb-6"}
          >
            Real Results from <span className={designSystem.gradients.textOrangeRed}>Indian Builders</span>
          </motion.h2>

          <motion.p
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={designSystem.typography.body + " max-w-lg mb-8"}
          >
            Our ecosystem is built for execution. See how students are transforming their careers, building real portfolios, and escaping tutorial hell.
          </motion.p>
        </div>

        {/* Animation Side */}
        <div className="h-[600px] relative overflow-hidden flex gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] py-10">
          <TestimonialsColumn testimonials={column1} duration={25} className="flex-1" />
          <TestimonialsColumn testimonials={column2} duration={20} reverse className="hidden md:flex flex-1" />
        </div>
      </div>
    </SectionWrapper>
  );
}
