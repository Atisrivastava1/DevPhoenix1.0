"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Download, Trophy, Bell, ArrowRight, Zap, CheckCircle2, Circle, Clock, Terminal } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/sections/Footer';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { designSystem } from '@/lib/design-system';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'onboarding' | 'curriculum'>('onboarding');

  const onboardingSteps = [
    { id: 1, title: 'Consultation Completed', desc: 'Syllabus and custom career path finalized with your mentor.', status: 'completed' },
    { id: 2, title: 'Under Review', desc: 'Application approved for the AI-Automation Masterclass Cohort 4.', status: 'completed' },
    { id: 3, title: 'Provisioning Sandbox Access', desc: 'Configuring private AWS environments and self-hosted n8n instances.', status: 'active' },
    { id: 4, title: 'Fully Enrolled', desc: 'Unlock live cohorts, group sandbox calls, and priority review channels.', status: 'upcoming' }
  ];

  const courses = [
    { title: 'AI Automation Mastery', progress: 45, nextLecture: 'Today, 8:30 PM (IST)', modulesCompleted: 4, totalModules: 9 }
  ];

  const toolkits = [
    { name: 'AI Agent Boilerplate (Next.js + LangChain)', type: 'GitHub Starter', size: '2.4 MB' },
    { name: 'n8n Advanced Flow Template Pack', type: 'JSON Blueprint', size: '1.1 MB' },
    { name: 'Industrial SaaS Integration Schema', type: 'PDF Blueprint', size: '4.8 MB' }
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-24 bg-[#FFF9F5]">
        
        <SectionWrapper background="cream" className="pb-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-3">
                <Zap className="w-3.5 h-3.5" /> BUILDER MODE ACTIVE
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                Welcome back, Builder 🚀
              </h1>
              <p className="text-slate-500 mt-1">Keep pushing limits. Your private developer resources are below.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black">
                14
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Learning Streak</p>
                <p className="text-sm font-bold text-slate-800">Days Consistent</p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper background="white" className="pb-32">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Tabs & Main Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Tab Selector */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl max-w-sm">
                <button
                  onClick={() => setActiveTab('onboarding')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'onboarding' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Onboarding Pipeline
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'curriculum' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  My Curriculums
                </button>
              </div>

              {/* Onboarding tab */}
              {activeTab === 'onboarding' && (
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Your Consultative Onboarding</h2>
                    <p className="text-sm text-slate-500 mt-1">Our enrollment engine is setting up your workspaces.</p>
                  </div>
                  
                  <div className="relative border-l border-slate-100 pl-6 ml-3 space-y-8 py-2">
                    {onboardingSteps.map((step) => (
                      <div key={step.id} className="relative">
                        {/* Status Icon */}
                        <div className="absolute -left-[35px] top-0.5">
                          {step.status === 'completed' && (
                            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {step.status === 'active' && (
                            <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center animate-pulse shadow-md">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {step.status === 'upcoming' && (
                            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                              <Circle className="w-3 h-3 fill-current text-slate-300" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className={`font-bold text-sm ${step.status === 'active' ? 'text-orange-600' : step.status === 'completed' ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                          
                          {step.status === 'active' && (
                            <div className="mt-4 bg-orange-50/50 border border-orange-100/50 p-4 rounded-xl flex items-start gap-3">
                              <Terminal className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <p className="font-bold text-slate-800">Current Task</p>
                                <p className="text-slate-500 mt-0.5">Ops team is spinning up dockerized sandbox networks. Sandbox credentials will be emailed upon completion.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum tab */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  {courses.map((c, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md font-bold text-[10px] uppercase tracking-wider">Active Cohort</span>
                          <h3 className="text-xl font-bold text-slate-900 mt-2">{c.title}</h3>
                        </div>
                        <span className="text-sm font-black text-slate-900">{c.progress}% Finished</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Next Live Session</p>
                            <p className="text-xs font-bold text-slate-800">{c.nextLecture}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Modules Completed</p>
                            <p className="text-xs font-bold text-slate-800">{c.modulesCompleted} / {c.totalModules} Units</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5">
                        Access Curriculum Workspace <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actionable Downloads Panel */}
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Developer Toolkits & Starter packs</h2>
                  <p className="text-sm text-slate-500 mt-1">Get headstarts using our validated code schema booleans.</p>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {toolkits.map((kit, idx) => (
                    <div key={idx} className="py-4 flex justify-between items-center first:pt-0 last:pb-0 group">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 group-hover:text-orange-600 transition-colors">{kit.name}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{kit.type} · {kit.size}</span>
                      </div>
                      <button className="p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:border-orange-100 text-slate-500 hover:text-orange-500 transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Certificates & Notifications */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Certification Tracker */}
              <div className="bg-[#151821] border border-slate-800 rounded-2xl p-6 space-y-5 text-white">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-400" /> Certificates Hub
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                     <p className="text-[9px] font-bold text-orange-400 tracking-wider uppercase mb-1">In Progress</p>
                     <h4 className="font-bold text-xs">AI Automation Architect</h4>
                     <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Submit your dynamic portfolio project to unlock certification.</p>
                  </div>

                  <div className="bg-slate-900/20 p-4 rounded-xl border border-slate-800/40 opacity-50">
                     <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mb-1">Locked</p>
                     <h4 className="font-bold text-xs">SaaS Product Engineer</h4>
                     <p className="text-[10px] text-slate-500 mt-1">Unlocks in Module 7.</p>
                  </div>
                </div>
              </div>

              {/* Quick Activity Alerts */}
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Bell className="w-5 h-5 text-orange-500 animate-swing" /> Recent Activity
                </h3>
                
                <div className="space-y-4 text-xs">
                  <div className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                    <div>
                      <p className="text-slate-800 font-semibold">Workspace Provisioning Started</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Your sandbox environment has been initiated.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                    <div>
                      <p className="text-slate-600 font-semibold">Mentor consultation completed</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">May 18, 2026</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </SectionWrapper>

      </div>
      <Footer />
    </>
  );
}
