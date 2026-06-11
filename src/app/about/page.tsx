"use client";

import { motion } from "framer-motion";
import { Sparkles, Compass, Lightbulb, Users } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { designSystem } from "@/lib/design-system";
import { designSystem } from "@/lib/design-system";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [config, setConfig] = useState<any>({ contact: {}, socials: {} });

  useEffect(() => {
    fetch('/api/site-config', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const payload = d && d.success && d.data ? d.data : (d || {});
        setConfig({
          contact: payload.contact || {},
          socials: payload.socials || {}
        });
      })
      .catch(() => {});
  }, []);

  const socialLinks = Object.entries(config.socials || {})
    .filter(([_, url]) => !!url)
    .map(([network, url]) => ({
      label: network.charAt(0).toUpperCase() + network.slice(1),
      href: url as string
    }));

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-24 bg-[#FFF9F5]">
        
        {/* Vision Hero */}
        <SectionWrapper background="cream">
          <div className="flex flex-col items-center text-center mb-16 relative">
            <motion.div
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">OUR VISION</span>
            </motion.div>
            
            <motion.h1
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight"
            >
              Redefining Education for the <br />
              <span className={designSystem.gradients.textOrangeRed}>AI Generation.</span>
            </motion.h1>
            
            <motion.p
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10"
            >
              We believe the future belongs to builders. DevPhoeniX is an ecosystem built to empower the next generation of creators, innovators, and leaders with real-world skills and AI-native workflows.
            </motion.p>
          </div>

          <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(249,115,22,0.2)]">
            <Image 
              src="/about/vision-hero.png" 
              alt="DevPhoeniX Vision" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          </div>
        </SectionWrapper>

        {/* Philosophy / Pillars */}
        <SectionWrapper background="white" className="py-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Our Ecosystem Philosophy</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Education shouldn't just be about consuming information. It should be about transformation and execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "AI-Powered", icon: <Compass className="w-6 h-6"/>, desc: "We embed AI tools and workflows into every learning path, ensuring you are prepared for the future of work." },
              { title: "Industry Aligned", icon: <Lightbulb className="w-6 h-6"/>, desc: "Our curriculum is dictated by what the industry needs today, not what was relevant five years ago." },
              { title: "Builder Centric", icon: <Users className="w-6 h-6"/>, desc: "Everything we do is focused on helping you build, ship, and launch real products." }
            ].map((pillar, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 hover:border-orange-100 transition-colors group text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white text-orange-500 flex items-center justify-center shadow-sm border border-slate-100 mb-6 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{pillar.title}</h3>
                <p className="text-slate-600 leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Social Proof & Contact */}
        <SectionWrapper background="cream" className="pb-32">
          <div className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
                
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Join the Movement</h2>
                  <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                    We are building an ecosystem that thrives on collaboration, innovation, and mutual growth. Connect with us to be a part of the future.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Email Us</p>
                      <a href={`mailto:${config.contact?.email || 'hello@devphoenix.tech'}`} className="text-lg font-bold text-slate-900 hover:text-orange-500 transition-colors">
                        {config.contact?.email || 'hello@devphoenix.tech'}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Call Us</p>
                      <p className="text-lg font-bold text-slate-900">{config.contact?.phone || '+91 00000 00000'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                   {socialLinks.map((link, idx) => (
                     <a 
                       key={idx} 
                       href={link.href} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-colors group"
                     >
                       <span className="font-bold text-slate-700 group-hover:text-orange-600 transition-colors">Follow us on {link.label}</span>
                       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-orange-500 transition-colors">
                         <Compass className="w-5 h-5" />
                       </div>
                     </a>
                   ))}
                </div>

             </div>
          </div>
        </SectionWrapper>

      </div>
      <Footer />
    </>
  );
}
