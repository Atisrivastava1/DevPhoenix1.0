import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import PublicChrome from "@/components/layout/PublicChrome";
import { PremiumToastContainer } from "@/components/ui/PremiumToast";
import { SpeculationRules } from "@/components/ui/SpeculationRules";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://devphoenix.tech'),
  title: {
    template: '%s | DevPhoeniX',
    default: 'DevPhoeniX — Build. Ship. Rise.',
  },
  description: 'DevPhoeniX is India\'s premium AI-native education platform. Learn Full Stack, AI Automation, Cloud, and Data — from real builders, for real careers.',
  keywords: ['devphoenix', 'learn coding india', 'AI automation course', 'full stack development india', 'cloud computing course', 'tech education', 'builder ecosystem'],
  authors: [{ name: 'DevPhoeniX Team', url: 'https://devphoenix.tech' }],
  creator: 'DevPhoeniX Technologies',
  publisher: 'DevPhoeniX Technologies',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://devphoenix.tech' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://devphoenix.tech',
    siteName: 'DevPhoeniX',
    title: 'DevPhoeniX — Build. Ship. Rise.',
    description: 'India\'s premium AI-native education platform. Real projects. Real systems. Real careers.',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'DevPhoeniX — Build. Ship. Rise.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevPhoeniX — Build. Ship. Rise.',
    description: 'India\'s premium AI-native education platform.',
    images: ['/og/default.png'],
    creator: '@devphoenix_in',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#FFF9F5] text-slate-900 selection:bg-orange-200"
        suppressHydrationWarning
      >
        {/* PublicChrome renders Navbar + LeadPopup only on non-admin pages */}
        <PublicChrome />
        {children}
        <PremiumToastContainer />
        <SpeculationRules />
      </body>
    </html>
  );
}

