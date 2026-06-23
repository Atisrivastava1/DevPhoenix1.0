"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const AnimatedNavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => {
  const defaultTextColor = isActive ? 'text-orange-600 font-semibold' : 'text-slate-600';
  const hoverTextColor = 'text-orange-600 font-semibold';
  const textSizeClass = 'text-sm font-medium';

  return (
    <Link href={href} className={`group relative inline-block overflow-hidden h-5 flex items-center whitespace-nowrap ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </Link>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const defaultNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const [items, setItems] = useState(defaultNavItems);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // 1. Try reading from sessionStorage cache first
    const cached = typeof window !== 'undefined' ? sessionStorage.getItem('/api/site-config') : null;
    if (cached) {
      try {
        const { val, expiry } = JSON.parse(cached);
        if (expiry > Date.now() && Array.isArray(val.navItems)) {
          setItems(val.navItems);
        }
      } catch {}
    }

    fetch('/api/site-config', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const payload = d && d.success && d.data ? d.data : (d || {});
        if (Array.isArray(payload.navItems)) {
          setItems(payload.navItems);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('/api/site-config', JSON.stringify({
              val: payload,
              expiry: Date.now() + 60000 // Cache for 1 minute
            }));
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-[24px]');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const renderLoginButton = (onClick?: () => void) => (
    <Link href="/login" onClick={onClick} className="w-full sm:w-auto">
      <button className="px-5 py-2 sm:px-4 text-xs sm:text-sm font-semibold border border-slate-200 bg-white/50 text-slate-700 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200 w-full sm:w-auto cursor-pointer">
        Login
      </button>
    </Link>
  );

  const renderSignupButton = (onClick?: () => void) => (
    <Link href="/login" onClick={onClick} className="relative group w-full sm:w-auto block">
       <div className="absolute inset-0 -m-1 rounded-full
                     hidden sm:block
                     bg-orange-400
                     opacity-20 filter blur-md pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-40 group-hover:blur-lg group-hover:-m-2"></div>
       <button className="relative z-10 px-5 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto transform hover:-translate-y-0.5 block cursor-pointer">
         Join Now
       </button>
    </Link>
  );

  return (
    <header className={`fixed left-1/2 transform -translate-x-1/2 z-50
                       w-[calc(100%-2rem)] max-w-7xl
                       transition-all duration-300 ease-in-out
                       ${isScrolled ? 'top-3' : 'top-6'}`}>

      {/* Main Navbar Container */}
      <div className={`flex flex-col items-center
                      px-6 transition-all duration-300 ease-in-out
                      ${isScrolled ? 'py-2 bg-[#fdf8f3]/95 border-orange-950/10 shadow-[0_12px_40px_rgba(249,115,22,0.06)]' : 'py-3 bg-[#fdf8f3]/85 border-orange-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}
                      backdrop-blur-md
                      ${headerShapeClass}
                      border
                      w-full`}>

        <div className="flex items-center justify-between w-full">
          
          {/* LEFT → Logo */}
          <Link href="/" className="relative flex items-center shrink-0 z-50 group">
            <div className="absolute inset-0 bg-orange-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none" />
            <div className="relative w-[140px] h-[42px] sm:w-[170px] sm:h-[50px] lg:w-[220px] lg:h-[60px] flex-shrink-0 hover:scale-[1.02] transition-all duration-300">
              <Image
                src="/logo/devphoenix-logo.png"
                alt="DevPhoeniX Logo"
                fill
                priority
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 170px, 220px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* CENTER → Navigation */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto">
            {items.map((link) => (
              <AnimatedNavLink key={link.href} href={link.href} isActive={pathname === link.href}>
                {link.label}
              </AnimatedNavLink>
            ))}
          </nav>

          {/* RIGHT → Login + Join Now */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {renderLoginButton()}
            {renderSignupButton()}
          </div>

          {/* Mobile Hamburger */}
          <button className="lg:hidden flex items-center justify-center w-10 h-10 text-slate-700 bg-white/50 rounded-full border border-slate-100 focus:outline-none z-50" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
            {isOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`lg:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                         ${isOpen ? 'max-h-[500px] opacity-100 mt-6 mb-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'}`}>
          <nav className="flex flex-col items-center space-y-4 text-base w-full mb-6">
            {items.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`w-full text-center transition-colors font-medium ${pathname === link.href ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-center space-y-3 w-full">
            {renderLoginButton(() => setIsOpen(false))}
            {renderSignupButton(() => setIsOpen(false))}
          </div>
        </div>

      </div>
    </header>
  );
}
