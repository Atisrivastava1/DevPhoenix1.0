import { Users, MessageSquare, Globe, Target, PlayCircle, Rocket, UserCheck } from "lucide-react";
import React from "react";

export const communityFeaturesData = [
  {
    title: "Mentorship That Matters",
    description: "Learn from industry experts who guide, review, and help you level up.",
    icon: React.createElement(Users, { className: "w-5 h-5" })
  },
  {
    title: "Real Feedback. Real Growth.",
    description: "Get actionable feedback on your projects and improve faster.",
    icon: React.createElement(MessageSquare, { className: "w-5 h-5" })
  },
  {
    title: "Builder Community",
    description: "Collaborate with ambitious builders, creators, and learners.",
    icon: React.createElement(Globe, { className: "w-5 h-5" })
  },
  {
    title: "Accountability & Consistency",
    description: "Track progress, build streaks, and stay motivated.",
    icon: React.createElement(Target, { className: "w-5 h-5" })
  }
];

export const communityStatsData = [
  { value: "10K+", label: "Active Builders", subtext: "learning and growing together", icon: React.createElement(Users, { className: "w-6 h-6" }) },
  { value: "300+", label: "Expert Mentors", subtext: "guiding your journey", icon: React.createElement(UserCheck, { className: "w-6 h-6" }) },
  { value: "Live", label: "Daily Sessions", subtext: "workshops, Q&A and more", icon: React.createElement(PlayCircle, { className: "w-6 h-6" }) },
  { value: "1M+", label: "Messages Exchanged", subtext: "collaborate, discuss, and build", icon: React.createElement(MessageSquare, { className: "w-6 h-6" }) },
  { value: "Real", label: "Connections", subtext: "a network that stays with you forever", icon: React.createElement(Rocket, { className: "w-6 h-6" }) }
];

export const contactInfo = {
  email: "contact@devphoenix.com",
  phone: "+91 9734876490"
};

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/devphoenix_technologies/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/112698008/admin/page-posts/published/" },
  { label: "Facebook", href: "https://www.facebook.com/share/1APNuoguqk/?mibextid=wwXIfr" }
];
