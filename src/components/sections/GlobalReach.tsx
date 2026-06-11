"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { WorldMap } from "@/components/ui/WorldMap";
import { designSystem } from "@/lib/design-system";

const mapDots = [
  // Kolkata → USA (San Francisco)
  {
    start: { lat: 22.5726, lng: 88.3639, label: "Kolkata", labelOffset: { x: 0, y: -20 } },
    end: { lat: 37.7749, lng: -122.4194, label: "San Francisco", labelOffset: { x: 20, y: 0 } },
  },
  // Kolkata → UK (London)
  {
    start: { lat: 22.5726, lng: 88.3639 },
    end: { lat: 51.5074, lng: -0.1278, label: "London", labelOffset: { x: -15, y: -15 } },
  },
  // Kolkata → UAE (Dubai)
  {
    start: { lat: 22.5726, lng: 88.3639 },
    end: { lat: 25.2048, lng: 55.2708, label: "Dubai", labelOffset: { x: -10, y: 15 } },
  },
  // Kolkata → Singapore
  {
    start: { lat: 22.5726, lng: 88.3639 },
    end: { lat: 1.3521, lng: 103.8198, label: "Singapore", labelOffset: { x: 20, y: 10 } },
  },
  // Kolkata → Australia (Sydney)
  {
    start: { lat: 22.5726, lng: 88.3639 },
    end: { lat: -33.8688, lng: 151.2093, label: "Sydney", labelOffset: { x: 20, y: 15 } },
  },
  // Kolkata → Canada (Toronto)
  {
    start: { lat: 22.5726, lng: 88.3639 },
    end: { lat: 43.6532, lng: -79.3832, label: "Toronto", labelOffset: { x: -20, y: -15 } },
  },
  // Kolkata → Germany (Berlin)
  {
    start: { lat: 22.5726, lng: 88.3639 },
    end: { lat: 52.52, lng: 13.405, label: "Berlin", labelOffset: { x: 10, y: -20 } },
  },
  // Kolkata → Japan (Tokyo)
  {
    start: { lat: 22.5726, lng: 88.3639 },
    end: { lat: 35.6762, lng: 139.6503, label: "Tokyo", labelOffset: { x: 20, y: -10 } },
  },
];

const stats = [
  { value: "15+", label: "Countries" },
  { value: "50+", label: "Cities" },
  { value: "10K+", label: "Global Learners" },
  { value: "100%", label: "Remote Ready" },
];

export function GlobalReach() {
  return (
    <SectionWrapper background="cream" id="global-reach" overflowHidden>
      <SectionHeading
        badgeText="Global Impact"
        badgeIcon={Globe}
        title="Our Builders Are"
        highlightedText="Everywhere"
        subtitle="From India to the world — DevPhoeniX alumni are building, shipping, and leading at top companies across the globe."
      />

      {/* Stats row */}
      <motion.div
        initial={designSystem.motion.fadeInUp.initial}
        whileInView={designSystem.motion.fadeInUp.whileInView}
        viewport={designSystem.motion.fadeInUp.viewport}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-orange-100 shadow-sm"
          >
            <span className={`text-3xl md:text-4xl font-extrabold ${designSystem.gradients.textOrangeRed}`}>
              {stat.value}
            </span>
            <p className="text-slate-500 text-sm font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Map */}
      <motion.div
        initial={designSystem.motion.scaleUp.initial}
        whileInView={designSystem.motion.scaleUp.whileInView}
        viewport={designSystem.motion.scaleUp.viewport}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="rounded-2xl overflow-hidden border border-orange-100 bg-white/60 backdrop-blur-sm shadow-lg"
      >
        <WorldMap
          dots={mapDots}
          lineColor="#f97316"
          animationDuration={2}
          loop
        />
      </motion.div>
    </SectionWrapper>
  );
}
