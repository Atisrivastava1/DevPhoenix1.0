"use client";

import { motion } from "framer-motion";
import { designSystem } from "@/lib/design-system";
import { SectionWrapper } from "./SectionWrapper";
import { TestimonialCard } from "@/components/cards/TestimonialCard";

const stories = [
  {
    id: 1,
    name: "Aisha Sharma",
    role: "SaaS Founder",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop",
    quote: "I didn't just learn how to code; I learned how to build a product. Within 3 months, I launched my first AI SaaS platform and got my first 100 paying users.",
    program: "Full Stack Development",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Automation Engineer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=128&auto=format&fit=crop",
    quote: "The focus on real-world systems completely changed my perspective. The AI automation workflows I built during the program landed me a senior role.",
    program: "AI Automation",
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop",
    quote: "DevPhoeniX bridged the gap between theory and execution. The mentor feedback on my MVP was invaluable. This is what modern education should look like.",
    program: "Entrepreneurship",
  }
];

export function SuccessStories() {
  return (
    <SectionWrapper background="cream" className="border-t border-slate-100">
      <div className="flex flex-col items-center text-center mb-16 relative">
        <motion.div
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          BUILDER SUCCESS
        </motion.div>

        <motion.h2
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={designSystem.typography.sectionTitle + " mb-6"}
        >
          Real Results from <span className={designSystem.gradients.textOrangeRed}>Real Builders</span>
        </motion.h2>

        <motion.p
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={designSystem.typography.body + " max-w-2xl"}
        >
          Don't just take our word for it. See what our community of creators, developers, and founders are achieving.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.5 }}
            whileHover={designSystem.motion.hoverLift.whileHover as any}
            className="h-full"
          >
            <TestimonialCard 
              testimonial={{
                name: story.name,
                role: story.role,
                avatar: story.image,
                content: story.quote,
                program: story.program
              }} 
            />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
