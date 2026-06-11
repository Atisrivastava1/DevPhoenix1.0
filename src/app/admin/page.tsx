"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Inbox, Star, Users, TrendingUp, BookOpen,
  ArrowRight, Activity, Zap, Target, BarChart3, MessageSquare,
  Trophy, DollarSign, Calendar, Clock, CheckCircle2, ArrowUpRight,
  Filter, Search, UserCheck, Shield, Sparkles, AlertCircle, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

// ─── Sparkline Component ──────────────────────────────────────────────────────
function MiniSparkline({ values, color = '#FF6B00' }: { values: number[]; color?: string }) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min;
  const width = 120;
  const height = 30;
  const step = width / (values.length - 1);
  const points = values.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible opacity-80">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// ─── Stat Card Component ──────────────────────────────────────────────────────
function SaaSMetricCard({
  label, value, sub, icon: Icon, trend, trendUp = true, href, colorClass = 'text-pink-600 bg-pink-100', iconColorClass = 'text-pink-600 bg-pink-100'
}: {
  label: string; value: string | number; sub?: string;
  icon: any; trend?: string; trendUp?: boolean; href?: string; colorClass?: string; iconColorClass?: string;
}) {
  const card = (
    <div className={`rounded-3xl p-5 hover:shadow-lg transition-all duration-300 group relative overflow-hidden ${colorClass} border-none`}>
      <div className="flex flex-col gap-4 relative z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-black tracking-tight">{value}</p>
          <p className="text-sm font-semibold opacity-80 mt-0.5">{label}</p>
        </div>
        {trend && (
          <p className="text-xs font-bold mt-2">
            <span className="opacity-100">{trend}</span>
            {sub && <span className="opacity-60 ml-1 font-semibold">{sub}</span>}
          </p>
        )}
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

// ─── Main Dashboard Redesign ──────────────────────────────────────────────────
export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    Promise.all([
      fetch('/api/leads', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/programs', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/testimonials', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/mentors', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
    ]).then(([l, p, t, m]) => {
      const leadsList = l && l.success && Array.isArray(l.data) ? l.data : (Array.isArray(l) ? l : []);
      const programsList = p && p.success && Array.isArray(p.data) ? p.data : (Array.isArray(p) ? p : []);
      const testimonialsList = t && t.success && Array.isArray(t.data) ? t.data : (Array.isArray(t) ? t : []);
      const mentorsList = m && m.success && Array.isArray(m.data) ? m.data : (Array.isArray(m) ? m : []);

      setLeads(leadsList);
      setPrograms(programsList);
      setTestimonials(testimonialsList);
      setMentors(mentorsList);
      setLoading(false);
    });
  }, []);

  // Derived CRM metrics
  const newLeads = leads.filter(l => l.status === 'New' || !l.status).length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
  const consultationLeads = leads.filter(l => l.status === 'Consultation Scheduled').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;

  // Pipeline Values (Estimation based on Rs. 4,999 average enrollment fee per lead)
  const estLeadValue = 4999;
  const getPipelineVal = (count: number) => `₹${(count * estLeadValue).toLocaleString('en-IN')}`;
  const totalRevenue = convertedLeads * estLeadValue;

  // Interactive Chart Datasets
  const chartData = {
    '7d': [12, 19, 15, 22, 30, 28, 35],
    '30d': [10, 15, 8, 12, 22, 19, 25, 30, 28, 35, 42, 38, 45, 52, 48, 50, 62, 58, 65, 72, 68, 75, 82, 78, 85, 92, 88, 95, 108, 114],
    '90d': [30, 45, 52, 48, 65, 78, 82, 75, 92, 110, 105, 125, 142, 138, 160, 185, 192, 180, 210, 235, 220, 240, 268, 255, 290, 315, 310, 340, 375, 362, 390],
  };

  const getSvgPathCoordinates = (data: number[], width: number, height: number) => {
    if (data.length === 0) return '';
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min;
    const step = width / (data.length - 1);
    return data.map((v, i) => `${i * step},${height - 10 - ((v - min) / range) * (height - 20)}`).join(' L ');
  };

  const activeChartDataset = chartData[chartRange];
  const chartWidth = 550;
  const chartHeight = 220;
  const linePath = getSvgPathCoordinates(activeChartDataset, chartWidth, chartHeight);
  const areaPath = linePath ? `${linePath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z` : '';

  // Lead Sources percentages
  const leadSources = [
    { label: 'Website', count: Math.round(leads.length * 0.45) || 28, pct: '45%', color: 'bg-[#FF6B00]', stroke: '#FF6B00' },
    { label: 'Social Media', count: Math.round(leads.length * 0.25) || 16, pct: '25%', color: 'bg-[#2563EB]', stroke: '#2563EB' },
    { label: 'Referrals', count: Math.round(leads.length * 0.18) || 11, pct: '18%', color: 'bg-[#10B981]', stroke: '#10B981' },
    { label: 'Direct / Email', count: Math.round(leads.length * 0.12) || 7, pct: '12%', color: 'bg-[#8B5CF6]', stroke: '#8B5CF6' },
  ];

  // Quick Action Buttons
  const quickActions = [
    { href: '/admin/programs', title: '📚 Manage Programs', desc: 'Create and update courses', color: 'hover:border-orange-200 hover:shadow-orange-500/5' },
    { href: '/admin/mentors',  title: '👥 Manage Mentors', desc: 'Add and manage experts', color: 'hover:border-blue-200 hover:shadow-blue-500/5' },
    { href: '/admin/blog',     title: '📝 Create Blog',    desc: 'Publish new content',   color: 'hover:border-purple-200 hover:shadow-purple-500/5' },
    { href: '/admin/leads',    title: '📊 CRM Dashboard',   desc: 'Track lead performance',color: 'hover:border-emerald-200 hover:shadow-emerald-500/5' },
  ];

  // Upcoming Reminders
  const upcomingTasks = [
    { id: 1, text: 'Call Sneha Reddy (Qualified Lead)', time: 'Today, 2:30 PM', done: false },
    { id: 2, text: 'Review new mentor application: Dr. R. K. Sen', time: 'Tomorrow, 10:00 AM', done: false },
    { id: 3, text: 'Sync site configuration with media database', time: '01 Jun, 4:00 PM', done: true },
    { id: 4, text: 'Verify blog slug redirects for SEO audits', time: '03 Jun, 11:30 AM', done: false },
  ];

  // Activity Feed
  const activityFeed = [
    { id: 1, user: 'Amit Singh', event: 'signed up for Full Stack Development', time: '10 mins ago', type: 'inquiry' },
    { id: 2, user: 'Dr. Sen', event: 'updated mentor profile credentials', time: '1 hour ago', type: 'mentor' },
    { id: 3, user: 'System', event: 'compacted cache folder storage', time: '3 hours ago', type: 'system' },
    { id: 4, user: 'Pooja Patel', event: 'requested curriculum consultation scheduled', time: '5 hours ago', type: 'inquiry' },
  ];

  // Counselors Leaderboard
  const teamLeaderboard = [
    { name: 'Rajesh Kumar', role: 'Senior Mentor', conversion: '94%', revenue: '₹4,80,000', leads: 48, rating: '4.9/5' },
    { name: 'Anjali Sen', role: 'Career Advisor', conversion: '88%', revenue: '₹3,20,000', leads: 32, rating: '4.8/5' },
    { name: 'Vikram Malhotra', role: 'Coach Director', conversion: '85%', revenue: '₹2,90,000', leads: 29, rating: '4.7/5' },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Filter leads list for the main table search
  const filteredLeads = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !search || l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.program?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Greeting */}
      <div className="hidden">
        {/* Intentionally hidden to match cleaner layout, page title is now in TopHeader */}
      </div>

      {/* Hero Stat Cards */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-black text-[#0F172A]">Today's Sales</h2>
            <p className="text-xs font-semibold text-slate-400">Sales Summary</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <ArrowUpRight className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SaaSMetricCard
            label="Total Revenue"
            value={`₹${totalRevenue.toLocaleString('en-IN')}`}
            trend="+12.4% vs last month"
            icon={DollarSign}
            colorClass="bg-pink-100 text-pink-700"
            iconColorClass="bg-pink-500 text-white"
          />
          <SaaSMetricCard
            label="New Leads"
            value={leads.length}
            trend="+5.2% vs last week"
            icon={Inbox}
            trendUp={true}
            colorClass="bg-orange-100 text-orange-700"
            iconColorClass="bg-orange-400 text-white"
            href="/admin/leads"
          />
          <SaaSMetricCard
            label="Conversion Rate"
            value={`${conversionRate}%`}
            trend="+1.2% vs last month"
            icon={Target}
            trendUp={true}
            colorClass="bg-emerald-100 text-emerald-700"
            iconColorClass="bg-emerald-400 text-white"
            href="/admin/leads"
          />
          <SaaSMetricCard
            label="Active Programs"
            value={programs.length || 8}
            trend="+0.5% vs last week"
            icon={GraduationCap}
            colorClass="bg-purple-100 text-purple-700"
            iconColorClass="bg-purple-400 text-white"
            href="/admin/programs"
          />
        </div>
      </div>

      {/* Analytics Rows */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Lead Growth Line Chart (70%) */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 col-span-2 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h3 className="text-lg font-black text-[#0F172A] tracking-tight">Interactive Lead Growth</h3>
            </div>
            <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-0.5">
              {(['7d', '30d', '90d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-3 py-1 text-2xs font-extrabold rounded-md transition-all ${
                    chartRange === range
                      ? 'bg-white text-[#FF6B00] shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          {/* SVG line chart */}
          <div className="relative h-[220px] w-full flex items-center justify-center">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="40" x2={chartWidth} y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2={chartWidth} y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2={chartWidth} y2="140" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="190" x2={chartWidth} y2="190" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Area Path */}
              {areaPath && <path d={areaPath} fill="url(#chart-glow)" />}
              
              {/* Line Path */}
              {linePath && (
                <path
                  d={`M ${linePath}`}
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Lead Sources Pie Chart (30%) */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 col-span-1 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-[#0F172A] tracking-tight">Lead Sources</h3>
          </div>
          
          <div className="flex justify-center my-6 relative items-center">
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="8" />
              {/* website segment (45% -> 107.5 dashoffset) */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#FF6B00" strokeWidth="8" strokeDasharray="238.76" strokeDashoffset="59.69" strokeLinecap="round" className="rotate-[-90deg] origin-center" />
              {/* social media segment (25% -> 59.69 dashoffset) */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#2563EB" strokeWidth="8" strokeDasharray="238.76" strokeDashoffset="119.38" strokeLinecap="round" className="rotate-[72deg] origin-center" />
              {/* referral (18% -> 42.9 dashoffset) */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray="238.76" strokeDashoffset="162.28" strokeLinecap="round" className="rotate-[162deg] origin-center" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <p className="text-2xl font-black text-slate-800">{leads.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">leads</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
            {leadSources.map(s => (
              <div key={s.label} className="flex items-center gap-1.5 p-1 rounded hover:bg-slate-50 transition-colors">
                <span className={`w-2 h-2 rounded-full shrink-0 ${s.color}`} />
                <span className="truncate flex-1">{s.label}</span>
                <span className="text-[#0F172A] font-bold">{s.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CRM Performance Kanban Board */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
        <div>
          <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Lead Pipeline CRM</h3>
          <p className="text-xs text-[#64748B] font-semibold mt-0.5 mb-5">Current stages of prospective enrollments</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'New Leads', count: newLeads, color: 'border-blue-200 text-blue-700 bg-blue-50' },
            { label: 'Contacted', count: contactedLeads, color: 'border-orange-200 text-orange-700 bg-orange-50' },
            { label: 'Qualified', count: qualifiedLeads, color: 'border-purple-200 text-purple-700 bg-purple-50' },
            { label: 'Consultation', count: consultationLeads, color: 'border-yellow-200 text-yellow-700 bg-yellow-50/50' },
            { label: 'Converted', count: convertedLeads, color: 'border-green-200 text-green-700 bg-green-50' },
          ].map((stage, i) => (
            <div key={stage.label} className="border border-slate-100/80 bg-slate-50/40 rounded-xl p-4 flex flex-col justify-between hover:bg-white hover:border-orange-100 hover:shadow-md transition-all duration-300 group">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${stage.color}`}>
                  {stage.label}
                </span>
                <p className="text-2xl font-black text-slate-800 mt-3">{stage.count}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-2xs font-semibold text-[#64748B]">
                <span>Est Value</span>
                <span className="text-[#0F172A] font-bold">{getPipelineVal(stage.count)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Performance grid */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
        <div>
          <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Program Performance</h3>
          <p className="text-xs text-[#64748B] font-semibold mt-0.5 mb-5">Metrics categorized by active certifications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(programs.length > 0 ? programs.slice(0, 3) : [
            { title: 'Full Stack Development', category: 'Development', id: '1', price: '₹4,999' },
            { title: 'Cloud & DevOps Masterclass', category: 'Cloud', id: '2', price: '₹5,999' },
            { title: 'AI & Automation Bootcamp', category: 'AI', id: '3', price: '₹6,999' }
          ]).map((prog, idx) => {
            const count = leads.filter(l => l.program === prog.title).length || (12 - idx * 3);
            const conv = Math.round((idx === 0 ? 0.35 : idx === 1 ? 0.28 : 0.22) * 100);
            const revVal = count * estLeadValue;

            return (
              <div key={prog.id || idx} className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition-all duration-300 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-extrabold text-slate-800 leading-snug truncate max-w-[180px]">{prog.title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{prog.category || 'Development'}</span>
                  </div>
                  <span className="text-xs bg-orange-50 border border-orange-100 text-orange-600 px-2 py-0.5 rounded-md font-bold">{prog.price || '₹4,999'}</span>
                </div>

                <div className="space-y-2 mt-4 text-xs font-semibold text-[#64748B]">
                  <div className="flex justify-between">
                    <span>Leads Generated</span>
                    <span className="text-slate-800 font-bold">{count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="text-[#10B981] font-bold">{conv}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue generated</span>
                    <span className="text-[#0F172A] font-extrabold">₹{revVal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${conv}%` }} className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-red-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Widgets Row (Revenue bar, timelines, leaderboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue bar chart */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Revenue Analysis</h3>
            <p className="text-xs text-[#64748B] font-semibold mt-0.5 mb-4">Monthly revenue performance</p>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-36 px-2">
            {[
              { m: 'Jan', val: 32 }, { m: 'Feb', val: 40 }, { m: 'Mar', val: 55 },
              { m: 'Apr', val: 48 }, { m: 'May', val: 75 }, { m: 'Jun', val: 60 }
            ].map(m => (
              <div key={m.m} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="relative w-full flex items-end justify-center bg-slate-50 border border-slate-100 rounded-lg h-28 overflow-hidden">
                  <div
                    style={{ height: `${m.val}%` }}
                    className="w-full bg-[#FF6B00] opacity-80 group-hover:opacity-100 group-hover:bg-gradient-to-t group-hover:from-[#FF6B00] group-hover:to-red-500 rounded-b-md transition-all duration-300"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{m.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks Checklist */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Upcoming Tasks</h3>
              <p className="text-xs text-[#64748B] font-semibold mt-0.5">CRM advisor task list updates</p>
            </div>
            <span className="text-2xs text-[#FF6B00] font-black hover:underline cursor-pointer">Add task</span>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {upcomingTasks.map(t => (
              <div key={t.id} className="flex items-start gap-2.5 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <input
                  type="checkbox"
                  defaultChecked={t.done}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 mt-0.5 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-snug ${t.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{t.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {t.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
          <div>
            <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Advisors Leaderboard</h3>
            <p className="text-xs text-[#64748B] font-semibold mt-0.5 mb-4">Team members monthly conversions</p>
          </div>

          <div className="space-y-3">
            {teamLeaderboard.map((member, i) => (
              <div key={member.name} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-xs">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{member.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold truncate">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-[#10B981]">{member.conversion}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{member.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Button cards */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-800">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ href, title, desc, color }) => (
            <Link key={href} href={href}>
              <div className={`group bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col items-start gap-1 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-md ${color}`}>
                <span className="text-sm font-extrabold text-[#0F172A] tracking-tight group-hover:text-[#FF6B00] transition-colors">{title}</span>
                <span className="text-xs text-[#64748B] font-semibold mt-1.5 leading-snug">{desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CRM Recent Leads Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-base font-extrabold text-slate-800">Recent CRM Leads</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search database..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition-all font-medium"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white border border-[#E2E8F0] text-slate-600 rounded-lg px-2 h-9 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B00] font-semibold"
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="border-b border-[#E2E8F0] bg-slate-50/50">
                <tr>
                  {['Name & Contact', 'Interested Program', 'Lead Source', 'Status', 'Assigned To', 'Date'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLeads.slice(0, 8).map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{lead.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{lead.email}</p>
                      <p className="text-slate-400 text-xs">{lead.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-orange-50 border border-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-bold">
                        {lead.program || 'General Inquiry'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-bold">{lead.source_page || 'Direct'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        lead.status === 'Converted' ? 'bg-green-50 text-green-700 border-green-100' :
                        lead.status === 'Contacted' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        lead.status === 'Lost' ? 'bg-red-50 text-red-700 border-red-100' :
                        lead.status === 'Qualified' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>{lead.status || 'New'}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-semibold flex items-center gap-1.5 mt-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Rajesh Kumar
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-semibold whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Activity Timeline Feed widget */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
        <div>
          <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Recent Activity Feed</h3>
          <p className="text-xs text-[#64748B] font-semibold mt-0.5 mb-5">Real-time system events stream</p>
        </div>

        <div className="space-y-4">
          {activityFeed.map(feed => (
            <div key={feed.id} className="flex items-start gap-3.5 pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                feed.type === 'inquiry' ? 'bg-orange-50 text-[#FF6B00]' :
                feed.type === 'mentor' ? 'bg-purple-50 text-[#8B5CF6]' : 'bg-slate-100 text-slate-600'
              }`}>
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 leading-snug">
                  <span className="font-bold text-slate-800">{feed.user}</span> {feed.event}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block font-semibold">{feed.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
