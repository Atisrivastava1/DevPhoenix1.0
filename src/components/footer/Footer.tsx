"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { DevPhoenixTextHover, FooterBackgroundGlow } from "./FooterEffects";

// ─── Static SVG icons (can't be stored in JSON) ──────────────────────────────
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  facebook: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  github: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
};

// ─── Hardcoded fallback (used until API loads) ────────────────────────────────
const FALLBACK = {
  contact: { email: "devphoenix@zohomail.in", phone: "+91 9734876490" },
  socials: {
    instagram: "https://www.instagram.com/devphoenix_technologies/",
    linkedin: "https://www.linkedin.com/company/112698008/",
    facebook: "https://www.facebook.com/share/1APNuoguqk/?mibextid=wwXIfr",
  },
  footerColumns: [
    {
      title: "Platform",
      links: [
        { label: "Learning Paths", href: "/learning-paths" },
        { label: "Programs", href: "/programs" },
        { label: "Builder Showcase", href: "/showcase" },
        { label: "Community", href: "/community" },
        { label: "Blog", href: "/blog" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Mentorship", href: "/mentors" },
        { label: "Industrial Training", href: "/programs#industrial" },
        { label: "Certifications", href: "/programs" },
        { label: "Student Projects", href: "/showcase" },
        { label: "FAQs", href: "/#faq" },
        { label: "Contact", href: "mailto:devphoenix@zohomail.in" },
      ],
    },
  ],
  footer: {
    tagline: "Building AI-native builders, creators, and future-ready innovators. Real projects. Real systems. Real careers.",
    copyright: `© ${new Date().getFullYear()} DevPhoeniX Technologies. All rights reserved.`,
  },
};

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-5">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-slate-400 text-sm hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 inline-block"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────
export function Footer() {
  const [cfg, setCfg] = useState(FALLBACK);

  useEffect(() => {
    fetch('/api/site-config', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const payload = d && d.success && d.data ? d.data : (d || {});
        setCfg({
          contact: payload.contact || FALLBACK.contact,
          socials: payload.socials || FALLBACK.socials,
          footerColumns: payload.footerColumns || FALLBACK.footerColumns,
          footer: payload.footer || FALLBACK.footer,
        });
      })
      .catch(() => {}); // keep fallback on error
  }, []);

  const socials = Object.entries(cfg.socials)
    .filter(([key, href]) => SOCIAL_ICONS[key] && href && (href as string).trim() !== '')
    .map(([key, href]) => ({ key, href: href as string, icon: SOCIAL_ICONS[key] }));

  return (
    <footer className="relative bg-[#07080C] overflow-hidden">
      <FooterBackgroundGlow />

      {/* Content grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 pb-16 border-b border-white/5">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <Image src="/logo/devphoenix-logo.png" alt="DevPhoeniX Logo" fill className="object-contain" />
              </div>
              <span className="text-white font-extrabold text-3xl tracking-tight">DevPhoeniX</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {cfg.footer.tagline}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-orange-500 tracking-widest uppercase">#FollowTheRise</span>
            </div>
          </div>

          {/* Dynamic link columns */}
          {cfg.footerColumns.map((col: any) => (
            <FooterLinks key={col.title} title={col.title} links={col.links} />
          ))}

          {/* Contact column */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-5">Get in Touch</h4>
            <ul className="space-y-3.5">
              {cfg.contact.email && cfg.contact.email.trim() !== '' && (
                <li>
                  <a
                    href={`mailto:${cfg.contact.email}`}
                    className="flex items-center gap-3 text-slate-400 text-sm hover:text-orange-400 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-all">
                      <Mail className="w-4 h-4" />
                    </span>
                    {cfg.contact.email}
                  </a>
                </li>
              )}
              {cfg.contact.phone && cfg.contact.phone.trim() !== '' && (
                <li>
                  <a
                    href={`tel:${cfg.contact.phone}`}
                    className="flex items-center gap-3 text-slate-400 text-sm hover:text-orange-400 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-all">
                      <Phone className="w-4 h-4" />
                    </span>
                    {cfg.contact.phone}
                  </a>
                </li>
              )}
            </ul>

            {/* Socials */}
            {socials.length > 0 && (
              <div className="mt-6">
                <p className="text-slate-600 text-xs uppercase font-bold tracking-widest mb-3">Follow Us</p>
                <div className="flex items-center gap-3">
                  {socials.map(({ key, href, icon }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-orange-400 hover:border-orange-500/30 hover:bg-orange-500/10 hover:shadow-[0_0_12px_rgba(255,107,0,0.2)] transition-all duration-200"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
          <p className="text-slate-600 text-xs text-center md:text-left">
            {cfg.footer.copyright || `© ${new Date().getFullYear()} DevPhoeniX Technologies. All rights reserved.`}
          </p>
          <div className="flex gap-6 text-xs text-slate-600">
            <Link href="/about" className="hover:text-slate-400 transition-colors">About</Link>
            <Link href="/programs" className="hover:text-slate-400 transition-colors">Programs</Link>
            <a href={`mailto:${cfg.contact.email}`} className="hover:text-slate-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>

      {/* Cinematic DEVPHOENIX hover text */}
      <div className="relative z-10 hidden lg:flex h-[22rem] -mt-28 -mb-24 w-full overflow-hidden">
        <DevPhoenixTextHover text="DEVPHOENIX" />
      </div>

      {/* #FollowTheRise tagline */}
      <div className="relative z-10 text-center pb-8 hidden lg:block">
        <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-orange-500/30">
          #FollowTheRise
        </span>
      </div>
    </footer>
  );
}
