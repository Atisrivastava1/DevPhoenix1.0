export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  content: string;
  program: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Arjun Desai",
    role: "Backend Developer",
    company: "TCS",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=128&auto=format&fit=crop",
    content: "The focus wasn't just on syntax, it was on system design. Within 4 months, I transitioned from an IT support role to a core backend team. Real-world execution matters.",
    program: "Full Stack Development"
  },
  {
    id: "t2",
    name: "Sneha Reddy",
    role: "Freelance Automator",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop",
    content: "I didn't know how to code, but the AI Automation program taught me how to connect APIs and build workflows. I now consult for 3 local businesses, automating their lead generation.",
    program: "AI Automation"
  },
  {
    id: "t3",
    name: "Vikram Singh",
    role: "Pre-final Year Student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop", // Using placeholder avatars
    content: "College taught me theory, DevPhoeniX taught me how to ship. My AWS deployment portfolio project was the sole reason I cleared my technical internship interview.",
    program: "Cloud Computing (AWS)"
  },
  {
    id: "t4",
    name: "Riya Sharma",
    role: "Product Analyst",
    company: "Startup Inc",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop",
    content: "The Data Analytics course cut through the noise. Instead of just learning Pandas, I learned how to extract actionable business insights from messy databases.",
    program: "Data Analytics"
  },
  {
    id: "t5",
    name: "Karan Patel",
    role: "Frontend Intern",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=128&auto=format&fit=crop",
    content: "I was stuck in tutorial hell for a year. The structured roadmap and mentor feedback on my pull requests finally gave me the confidence to build and deploy on my own.",
    program: "Full Stack Development"
  },
  {
    id: "t6",
    name: "Neha Gupta",
    role: "Marketing Specialist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop",
    content: "Learning how to leverage AI tools in my digital marketing campaigns increased our client conversion rates by 30%. The practical approach is unmatched.",
    program: "Digital Marketing"
  }
];
