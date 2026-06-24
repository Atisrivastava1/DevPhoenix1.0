"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, GraduationCap, Star, Users,
  Briefcase, PenSquare, MessageSquare, Inbox, Settings,
  Globe, Link2, ChevronLeft, ChevronRight, LogOut, Home,
  Image as ImageIcon, Target, Trophy, Menu, ShieldAlert,
  ChevronDown, Zap
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { href: '/admin/leads', icon: Inbox, label: 'Leads' },
      { href: '/admin/contacts', icon: Users, label: 'Contacts' },
      { href: '/admin/opportunities', icon: Target, label: 'Opportunities' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/homepage', icon: Home, label: 'Homepage' },
      { href: '/admin/programs', icon: GraduationCap, label: 'Programs' },
      { href: '/admin/learning-paths', icon: BookOpen, label: 'Learning Paths' },
      { href: '/admin/blog', icon: PenSquare, label: 'Blog' },
      { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: '/admin/mentors', icon: Trophy, label: 'Mentors' },
      { href: '/admin/community', icon: MessageSquare, label: 'Community' },
    ],
  },
  {
    label: 'Media & Config',
    items: [
      { href: '/admin/media', icon: ImageIcon, label: 'Assets Library' },
      { href: '/admin/navbar', icon: Link2, label: 'Navigation' },
      { href: '/admin/footer', icon: Globe, label: 'Footer Config' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    router.push('/admin-login');
  };

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-slate-600">
      {/* Brand Header */}
      <div className={`flex items-center gap-3 px-6 py-8 ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed && (
          <div className="relative w-36 h-9 flex items-center">
            <span className="text-slate-800 font-black text-xl flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#6366F1] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-500/30">DP</span>
              DevPhoeniX
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-[#6366F1] flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-extrabold text-xs">DP</span>
          </div>
        )}
      </div>

      {/* Nav Link Tree */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-5 custom-scrollbar">
        {navGroups.map(group => (
          <div key={group.label} className="space-y-1.5">
            {!collapsed && (
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 opacity-60">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map(item => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="relative">
                    {/* Active Accent Left Line */}
                    {active && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#FF6B00] rounded-r-md z-10" />
                    )}
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-semibold transition-all duration-300 group ${
                        active
                          ? 'bg-[#6366F1] text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]'
                          : 'hover:bg-slate-50 text-slate-500 hover:text-[#6366F1]'
                      } ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                        active ? 'text-white' : 'text-slate-400 group-hover:text-[#6366F1]'
                      }`} />
                      {!collapsed && <span className="tracking-wide">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Profile & Options */}
      <div className="p-5 space-y-2 mt-auto">
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-semibold transition-all ${
            isActive('/admin/settings') ? 'bg-[#6366F1] text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]' : 'text-slate-500 hover:bg-slate-50 hover:text-[#6366F1]'
          } ${collapsed ? 'justify-center' : ''}`}
        >
          <Settings className={`w-5 h-5 shrink-0 ${isActive('/admin/settings') ? 'text-white' : 'text-slate-400'}`} />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Pro Card removed as requested */}
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-[14px] text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 88 : 280 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-white relative shrink-0 h-screen sticky top-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
      >
        <SidebarContent />
        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-50 shadow-md cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile Top Bar Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="relative w-28 h-8 flex items-center">
          <span className="text-slate-800 font-black text-base flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-lg bg-[#6366F1] flex items-center justify-center text-white text-[10px] font-black">DP</span>
            DevPhoeniX
          </span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-400 hover:text-[#6366F1] p-1 rounded-lg hover:bg-slate-50 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Slider */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden fixed left-0 top-0 h-full w-[280px] bg-white z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
