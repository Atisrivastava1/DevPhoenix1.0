"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import LeadPopup from '@/components/sections/LeadPopup';
import { FloatingEnquiryCTA } from '@/components/cta/FloatingEnquiryCTA';

export default function PublicChrome() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dp-cache-version') {
        sessionStorage.removeItem('/api/site-config');
        sessionStorage.removeItem('/api/visual-blocks');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isAdmin) return null;
  return (
    <>
      <Navbar />
      <LeadPopup />
      <FloatingEnquiryCTA />
    </>
  );
}
