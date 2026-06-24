"use client";
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Mail, Sun, Moon, LogOut, Settings, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Global Fetch Interceptor to invalidate public site config and visual blocks caches upon admin modifications
if (typeof window !== 'undefined' && !(window as any).__fetchIntercepted) {
  (window as any).__fetchIntercepted = true;
  const originalFetch = window.fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const response = await originalFetch(input, init);
    try {
      const method = (init?.method || (typeof input === 'object' && 'method' in input ? (input as any).method : 'GET')).toUpperCase();
      if (response.ok && ['POST', 'PUT', 'DELETE'].includes(method)) {
        sessionStorage.removeItem('/api/site-config');
        sessionStorage.removeItem('/api/visual-blocks');
        localStorage.setItem('dp-cache-version', Date.now().toString());
      }
    } catch (e) {}
    return response;
  };
}

export default function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    router.push('/admin-login');
  };

  // Resolve breadcrumbs dynamically
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    if (paths.length <= 1) {
      return [
        { label: 'Dashboard', href: '/admin' },
        { label: 'Overview', href: '/admin' }
      ];
    }
    return paths.map((path, idx) => {
      const href = '/' + paths.slice(0, idx + 1).join('/');
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
      return { label, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="hidden lg:flex h-16 border-b border-[#E2E8F0] bg-white items-center justify-between px-8 sticky top-0 z-30 select-none shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
      {/* Left: Dashboard Title */}
      <div className="flex-1">
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Dashboard</h1>
      </div>

      {/* Center: Search Input */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6366F1]" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full h-11 pl-11 pr-4 rounded-[14px] border-none bg-slate-50 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 transition-all placeholder:text-slate-400 font-semibold"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        {/* Language Selector */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
          <span className="text-base">🇺🇸</span>
          <span className="text-sm font-bold text-slate-700">Eng (US)</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-full bg-orange-50 text-[#FF6B00] hover:bg-orange-100 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-orange-50 bg-[#6366F1]" />
          </button>

          {/* Simple Dropdown list */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in duration-200">
                <p className="text-xs font-black text-slate-800 uppercase tracking-wide mb-3">Notifications</p>
                <div className="space-y-2">
                  <div className="p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-slate-700">New lead inquiry received</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 minutes ago &bull; CRM</p>
                  </div>
                  <div className="p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-slate-700">Database backup complete</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">1 hour ago &bull; System</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 hover:bg-slate-50 px-2 py-1 rounded-xl transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden relative">
              <Image src="https://ui-avatars.com/api/?name=Admin+User&background=6366F1&color=fff" alt="Profile" fill className="object-cover" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-[#0F172A] leading-tight">Admin User</p>
              <p className="text-xs font-semibold text-slate-400">Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in duration-200">
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </Link>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
