"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Code2, Cpu, Globe, Rocket, HelpCircle, Layers } from 'lucide-react';

interface DynamicImageProps {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  priority?: boolean;
  category?: string;
}

export function DynamicImage({
  src,
  alt,
  className = '',
  sizes,
  fill,
  priority,
  category = ''
}: DynamicImageProps) {
  const [error, setError] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  useEffect(() => {
    setError(false);
    setIsPlaceholder(false);

    // Check if the image source looks like a 68-byte stub or placeholder path
    if (!src || src === "" || src.includes('placeholder') || src.includes('example.com')) {
      setIsPlaceholder(true);
    }
  }, [src]);

  // Determine fallback icon & color theme based on category or alt text
  const getFallbackTheme = () => {
    const text = (category + ' ' + alt).toLowerCase();
    
    if (text.includes('ai') || text.includes('automation') || text.includes('n8n') || text.includes('openai')) {
      return {
        bg: 'from-orange-600/90 to-amber-700/90',
        icon: <Cpu className="w-10 h-10 text-white animate-pulse" />,
        label: 'AI & Automation'
      };
    }
    if (text.includes('saas') || text.includes('fullstack') || text.includes('full stack') || text.includes('web') || text.includes('react') || text.includes('next.js')) {
      return {
        bg: 'from-blue-600/90 to-indigo-700/90',
        icon: <Code2 className="w-10 h-10 text-white" />,
        label: 'Web Systems'
      };
    }
    if (text.includes('cloud') || text.includes('devops') || text.includes('aws') || text.includes('docker') || text.includes('infrastructure')) {
      return {
        bg: 'from-indigo-600/90 to-purple-700/90',
        icon: <Layers className="w-10 h-10 text-white" />,
        label: 'Cloud & DevOps'
      };
    }
    if (text.includes('startup') || text.includes('mvp') || text.includes('builder') || text.includes('launch') || text.includes('entrepreneurship')) {
      return {
        bg: 'from-red-600/90 to-orange-600/90',
        icon: <Rocket className="w-10 h-10 text-white" />,
        label: 'Startup MVP'
      };
    }
    if (text.includes('community') || text.includes('session') || text.includes('mentor') || text.includes('social')) {
      return {
        bg: 'from-emerald-600/90 to-teal-700/90',
        icon: <Globe className="w-10 h-10 text-white" />,
        label: 'Ecosystem'
      };
    }
    return {
      bg: 'from-orange-500/80 via-red-500/80 to-purple-600/80',
      icon: <Sparkles className="w-10 h-10 text-white" />,
      label: 'DevPhoeniX'
    };
  };

  const theme = getFallbackTheme();

  if (error || isPlaceholder) {
    return (
      <div className={`relative w-full h-full min-h-[160px] bg-gradient-to-br ${theme.bg} flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden ${className}`}>
        {/* Soft Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />
        <div className="absolute w-40 h-40 bg-white/10 rounded-full blur-2xl -top-10 -right-10 pointer-events-none" />
        <div className="absolute w-40 h-40 bg-black/10 rounded-full blur-2xl -bottom-10 -left-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
            {theme.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase block mb-1">
              {theme.label}
            </span>
            <h4 className="text-white font-extrabold text-sm line-clamp-1 max-w-[200px]">
              {alt}
            </h4>
          </div>
        </div>
      </div>
    );
  }

  // Real Dynamic Image utilizing standard Image or img tag depending on layout
  if (fill) {
    return (
      <Image
        src={src!}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      onError={() => setError(true)}
    />
  );
}
