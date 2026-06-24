export const designSystem = {
  colors: {
    primary: {
      orange: "bg-orange-500",
      red: "bg-red-500",
      amber: "bg-amber-400",
    },
    background: {
      cream: "bg-[#FFF9F5]",
      white: "bg-white",
      dark: "bg-slate-900",
      darker: "bg-[#0B1120]",
    },
    text: {
      slate: "text-slate-600",
      dark: "text-slate-900",
      light: "text-slate-300",
      white: "text-white",
      muted: "text-slate-500",
    },
    border: {
      light: "border-slate-100",
      orange: "border-orange-100",
      dark: "border-slate-800",
    }
  },
  gradients: {
    textOrangeRed: "text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500",
    textOrangeAmber: "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300",
    bgOrangeRed: "bg-gradient-to-r from-orange-500 to-red-500",
    bgDark: "bg-gradient-to-r from-slate-900 to-[#0B1120]",
    glowOrange: "bg-orange-500/10",
  },
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    soft: "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
    hover: "hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)]",
    dark: "shadow-[0_20px_50px_rgba(0,0,0,0.4)]",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.15)]",
    glass: "shadow-[0_8px_32px_0_rgba(31,38,135,0.03)]",
  },
  spacing: {
    sectionPadding: "py-20 lg:py-32 px-6 lg:px-8",
    containerMaxWidth: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    cardPadding: "p-6 lg:p-10",
    gap: {
      xs: "gap-2",
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-12",
    }
  },
  borderRadius: {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    "2xl": "rounded-[1.5rem]",
    "3xl": "rounded-[2rem]",
    card: "rounded-[2rem]",
    button: "rounded-xl",
    tag: "rounded-full",
    full: "rounded-full",
  },
  typography: {
    hero: "text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]",
    sectionTitle: "text-3xl md:text-5xl font-extrabold tracking-tight leading-tight",
    sectionSubtitle: "text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl",
    cardTitle: "text-xl md:text-2xl font-bold leading-snug",
    body: "text-sm md:text-base text-slate-600 leading-relaxed",
    muted: "text-xs md:text-sm text-slate-500 font-medium",
    label: "text-xs md:text-sm font-bold text-slate-700 tracking-wide",
  },
  motion: {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    },
    fadeIn: {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true },
      transition: { duration: 0.4 }
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.95 },
      whileInView: { opacity: 1, scale: 1 },
      viewport: { once: true },
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    },
    hoverLift: {
      whileHover: { y: -6, transition: { duration: 0.3, ease: "easeOut" as const } }
    },
    hoverScale: {
      whileHover: { scale: 1.02, transition: { duration: 0.2, ease: "easeOut" as const } }
    },
    hoverGlow: {
      whileHover: { boxShadow: "0 20px 40px rgba(249,115,22,0.08)", y: -4 }
    }
  }
};
