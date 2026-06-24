"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export function SchemaCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let time = 0;
    let animationFrameId: number;
    
    const waveData = Array.from({ length: 8 }).map(() => ({
      value: Math.random() * 0.5 + 0.1,
      targetValue: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01
    }));

    function resizeCanvas() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }

    function updateWaveData() {
      waveData.forEach(data => {
        if (Math.random() < 0.01) data.targetValue = Math.random() * 0.7 + 0.1;
        const diff = data.targetValue - data.value;
        data.value += diff * data.speed;
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.fillStyle = '#FFF9F5'; // Matches our DevPhoenix cream background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waveData.forEach((data, i) => {
        const freq = data.value * 7;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const nx = (x / canvas.width) * 2 - 1;
          const px = nx + i * 0.04 + freq * 0.03;
          const py = Math.sin(px * 10 + time) * Math.cos(px * 2) * freq * 0.1 * ((i + 1) / 8);
          const y = (py + 1) * canvas.height / 2;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const intensity = Math.min(1, freq * 0.3);
        
        // Custom DevPhoenix orange-ish colors instead of the purple from original code
        const r = 249; // orange-500
        const g = 115 + intensity * 50;
        const b = 22; 
        
        ctx.lineWidth = 1 + i * 0.2;
        ctx.strokeStyle = `rgba(${r},${g},${b},0.3)`;
        ctx.stroke();
      });
    }

    function animate() {
      time += 0.01;
      updateWaveData();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden rounded-[3rem] border border-orange-100 shadow-sm flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply" />
      
      {/* Overlay Content */}
      <div className="relative z-10 p-8 flex justify-center w-full">
        <div className="w-full max-w-sm">
          <div className="relative bg-white/70 backdrop-blur-xl border border-white overflow-hidden rounded-3xl flex flex-col shadow-[0_20px_50px_rgba(249,115,22,0.1)]">
            <div className="p-6 pb-0 flex justify-center relative">
              <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 inner-glow overflow-hidden relative border border-orange-200 shadow-inner">
                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full animate-pulse" style={{ backgroundImage: 'linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px), linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                </div>
              </div>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent my-4" />
            <div className="p-6 pt-0">
              <span className="inline-block px-3 py-1 bg-white text-orange-500 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-orange-200 shadow-sm">
                Knowledge Graph
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Schema Management</h3>
              <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                Design, optimize and maintain your AI agent architecture with powerful visual tools.
              </p>
              <div className="flex justify-between items-center">
                <Link href="/programs/ai-automation" className="text-orange-500 hover:text-orange-600 transition flex items-center text-sm font-bold bg-white px-4 py-2 rounded-xl border border-orange-200 shadow-sm">
                  Explore Architecture
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
