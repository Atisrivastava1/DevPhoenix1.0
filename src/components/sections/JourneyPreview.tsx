"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { designSystem } from "@/lib/design-system";
import { ShineBorder } from "@/components/ui/ShineBorder";
import { Timeline, type Event } from "@/components/ui/Timeline";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { ReactiveMascot } from "@/components/ui/ReactiveMascot";
import { SimulatorDashboard } from "@/components/ui/SimulatorDashboard";
import { EnquireModal } from "@/components/ui/EnquireModal";

const FALLBACK_STEPS: Event[] = [
  {
    label: "Explore & Choose",
    message: "Find the right premium or industrial program based on your career goals.",
    icon: {
      name: "Network",
      textColor: "text-orange-500",
      borderColor: "border-orange-200 bg-orange-50",
    },
  },
  {
    label: "Master the Foundations",
    message: "Deep dive into core technologies with interactive, hands-on learning.",
    icon: {
      name: "TerminalSquare",
      textColor: "text-blue-500",
      borderColor: "border-blue-200 bg-blue-50",
    },
  },
  {
    label: "Build Real Systems",
    message: "Execute production-grade projects. No more simple todo apps.",
    icon: {
      name: "Component",
      textColor: "text-purple-500",
      borderColor: "border-purple-200 bg-purple-50",
    },
  },
  {
    label: "Get Mentored",
    message: "Receive code reviews and architectural guidance from top industry experts.",
    icon: {
      name: "CheckCircle",
      textColor: "text-green-500",
      borderColor: "border-green-200 bg-green-50",
    },
  },
  {
    label: "Launch Your Career",
    message: "Earn your verified certification and confidently crush your interviews.",
    icon: {
      name: "Rocket",
      textColor: "text-orange-600",
      borderColor: "border-orange-500/40 bg-orange-100",
    },
  },
];

export function JourneyPreview() {
  const [visualBlocks, setVisualBlocks] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive State
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const autoPlayRef = useRef(false);
  
  const { isEnabled, playChime, toggleSound } = useSoundEffects();

  // Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Calculate actual events list
  const getThemeMap = (variant: string) => {
    if (variant === 'blue') return { textColor: 'text-blue-500', borderColor: 'border-blue-200 bg-blue-50' };
    if (variant === 'purple') return { textColor: 'text-purple-500', borderColor: 'border-purple-200 bg-purple-50' };
    if (variant === 'green') return { textColor: 'text-green-500', borderColor: 'border-green-200 bg-green-50' };
    if (variant === 'orange-bold') return { textColor: 'text-orange-600', borderColor: 'border-orange-500/40 bg-orange-100' };
    return { textColor: 'text-orange-500', borderColor: 'border-orange-200 bg-orange-50' };
  };

  const mascotBlock = visualBlocks.find(b => b.id === 'journey-mascot');
  const uniqueStepBlocks = Array.from(
    new Map(
      visualBlocks
        .filter(b => b.id !== 'journey-mascot')
        .sort((a, b) => a.position - b.position)
        .map(b => [b.id, b])
    ).values()
  );

  const events: Event[] = uniqueStepBlocks.length > 0
    ? uniqueStepBlocks.map(b => ({
        label: b.title,
        message: b.description,
        icon: {
          name: b.badge || 'Check',
          ...getThemeMap(b.theme_variant)
        }
      }))
    : FALLBACK_STEPS;

  const numEvents = events.length;

  // React to scroll progress
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (numEvents === 0) return;
      const segment = 1 / numEvents;
      let newIndex = Math.floor(latest / segment);
      if (newIndex >= numEvents) newIndex = numEvents - 1;
      
      if (newIndex !== activeIndex && latest > 0) {
        if (newIndex > activeIndex && newIndex >= 0) {
          playChime(300 + (newIndex * 100)); // Ascending pitches
        }
        setActiveIndex(newIndex);
      } else if (latest === 0 && activeIndex !== -1) {
        setActiveIndex(-1);
      }
    });
  }, [scrollYProgress, activeIndex, numEvents, playChime]);

  // Transform progress for the glowing line
  const lineProgressValue = useState(0);
  useEffect(() => {
    return scrollYProgress.on("change", v => lineProgressValue[1](v));
  }, [scrollYProgress]);

  // Fetch Data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('/api/visual-blocks');
      if (cached) {
        try {
          const { val, expiry } = JSON.parse(cached);
          if (expiry > Date.now() && Array.isArray(val)) {
            setVisualBlocks(val.filter((b: any) => b.section_key === 'journey' && b.visibility));
          }
        } catch {}
      }
    }

    fetch('/api/visual-blocks', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const list = d && d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
        setVisualBlocks(list.filter((b: any) => b.section_key === 'journey' && b.visibility));
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('/api/visual-blocks', JSON.stringify({
            val: list,
            expiry: Date.now() + 60000 
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleAutoPlay = () => {
    if (autoPlayRef.current) {
      autoPlayRef.current = false;
      setIsAutoPlaying(false);
      return;
    }
    
    if (containerRef.current) {
      autoPlayRef.current = true;
      setIsAutoPlaying(true);
      const start = window.scrollY;
      const rect = containerRef.current.getBoundingClientRect();
      const end = start + rect.height; 
      const duration = 6000; // 6 seconds for full journey
      let startTime: number | null = null;
      
      const step = (timestamp: number) => {
        if (!autoPlayRef.current) return; 
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        
        window.scrollTo(0, start + (end - start) * ease);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          autoPlayRef.current = false;
          setIsAutoPlaying(false);
        }
      };
      window.requestAnimationFrame(step);
    }
  };

  const mascotImage = mascotBlock?.image_url || "/learning.png";

  return (
    <SectionWrapper background="cream" className="!pt-2 lg:!pt-6 !pb-16 lg:!pb-20 relative overflow-hidden">
      
      <EnquireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500 rounded-full blur-[120px]" />
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
        
        {/* Left Side: Cinematic Narrative */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center relative lg:sticky lg:top-32 lg:self-start">
          <motion.div
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-[10px] tracking-widest uppercase mb-6 shadow-sm w-fit"
          >
            THE DEVPHOENIX ECOSYSTEM
          </motion.div>
          
          <motion.h2 
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.1]"
          >
            Your Journey from <br />
            <span className="text-slate-400">Learner</span> to <span className={designSystem.gradients.textOrangeRed}>Builder</span>
          </motion.h2>

          <motion.p
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 mb-8 max-w-md"
          >
            We don't just teach syntax. We guide you through the exact pipeline used to build, scale, and deploy real-world products.
          </motion.p>

          <ReactiveMascot activeIndex={activeIndex} mascotImage={mascotImage} />
        </div>

        {/* Right Side: Timeline inside ShineBorder */}
        <motion.div 
          className="w-full lg:w-1/2 max-w-lg lg:max-w-none ml-auto pb-32"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
           <ShineBorder 
             color={["#f97316", "#fb923c", "#fdba74"]} 
             borderWidth={2}
             borderRadius={32}
             className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/60 backdrop-blur-xl border border-white/20 p-8 md:p-10"
           >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">The Execution Pipeline</h3>
                <SimulatorDashboard 
                  isSoundEnabled={isEnabled}
                  toggleSound={toggleSound}
                  isPlaying={isAutoPlaying}
                  onAutoPlay={handleAutoPlay}
                />
              </div>
              <Timeline 
                events={events} 
                activeIndex={activeIndex} 
                lineProgress={lineProgressValue[0]} 
              />
              
              <div className="mt-12 flex justify-center w-full">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full max-w-xs"
                >
                  Start Your Journey
                </button>
              </div>
           </ShineBorder>
        </motion.div>

      </div>
    </SectionWrapper>
  );
}

