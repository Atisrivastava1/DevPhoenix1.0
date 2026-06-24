"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// ─── DevPhoeniX Text Hover Effect (warm orange adaptation of NurUI pattern) ───
export function DevPhoenixTextHover({ text }: { text: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPos, setMaskPos] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const cx = ((cursor.x - rect.left) / rect.width) * 100;
      const cy = ((cursor.y - rect.top) / rect.height) * 100;
      setMaskPos({ cx: `${cx}%`, cy: `${cy}%` });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 80"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none uppercase cursor-default"
    >
      <defs>
        {/* Warm orange gradient revealed on hover */}
        <radialGradient id="dp-textGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          {hovered && (
            <>
              <stop offset="0%"   stopColor="#FFF1E7" />
              <stop offset="30%"  stopColor="#FFB36A" />
              <stop offset="60%"  stopColor="#FF8A3D" />
              <stop offset="100%" stopColor="#FF6B00" />
            </>
          )}
        </radialGradient>

        {/* Animated radial mask that follows cursor */}
        <motion.radialGradient
          id="dp-revealMask"
          gradientUnits="userSpaceOnUse"
          r="22%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPos}
          transition={{ duration: 0, ease: "easeOut" }}
        >
          <stop offset="0%"   stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="dp-textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dp-revealMask)" />
        </mask>
      </defs>

      {/* Layer 1: Dim outline (always present, fades in on hover) */}
      <text
        x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent font-bold"
        style={{
          stroke: '#FF6B00',
          strokeOpacity: hovered ? 0.15 : 0.08,
          fontSize: '52px',
          fontFamily: 'Geist, Inter, system-ui, sans-serif',
          fontWeight: 800,
          transition: 'stroke-opacity 0.4s ease',
          letterSpacing: '0.05em',
        }}
      >
        {text}
      </text>

      {/* Layer 2: Animated stroke draw (plays on load) */}
      <motion.text
        x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent"
        style={{
          stroke: '#FF8A3D',
          strokeOpacity: 0.6,
          fontSize: '52px',
          fontFamily: 'Geist, Inter, system-ui, sans-serif',
          fontWeight: 800,
          letterSpacing: '0.05em',
        }}
        initial={{ strokeDashoffset: 2000, strokeDasharray: 2000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 2000 }}
        transition={{ duration: 5, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      {/* Layer 3: Hot orange fill revealed only on hover via cursor mask */}
      <text
        x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
        stroke="url(#dp-textGradient)"
        strokeWidth="0.3"
        mask="url(#dp-textMask)"
        className="fill-transparent"
        style={{
          fontSize: '52px',
          fontFamily: 'Geist, Inter, system-ui, sans-serif',
          fontWeight: 800,
          letterSpacing: '0.05em',
        }}
      >
        {text}
      </text>
    </svg>
  );
}

// ─── Ambient radial background glow (warm phoenix colors) ─────────────────────
export function FooterBackgroundGlow() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base dark */}
      <div className="absolute inset-0 bg-[#07080C]" />
      {/* Warm radial top-center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(ellipse, #FF6B00 0%, transparent 70%)' }} />
      {/* Ember glow bottom-left */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full blur-[100px] opacity-10"
        style={{ background: 'radial-gradient(ellipse, #FF8A3D 0%, transparent 70%)' }} />
      {/* Subtle cream spark top-right */}
      <div className="absolute top-0 right-0 w-[300px] h-[200px] rounded-full blur-[80px] opacity-8"
        style={{ background: 'radial-gradient(ellipse, #FFF1E7 0%, transparent 70%)' }} />
    </div>
  );
}
