import { Bot, Settings, Zap, Layers, Code, PieChart, Cloud, PlayCircle, Rocket, Users, Database } from "lucide-react";
import React from "react";

export const learningPathsData = [
  {
    id: "01",
    title: "AI Foundations & Workflows",
    description: "Learn AI tools, prompt engineering, agentic workflows, and productivity systems to multiply your execution.",
    included: ["AI & Prompt Engineering", "Workflow Automation"],
    build: [
      { icon: React.createElement(Bot, { className: "w-4 h-4" }), text: "AI Research Assistant" },
      { icon: React.createElement(Settings, { className: "w-4 h-4" }), text: "Smart Workflow System" }
    ],
    tags: ["AI Tools", "Prompting", "Productivity"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "Web Engineering & DevOps",
    description: "Design modern responsive user interfaces, scalable backend APIs, database models, and cloud infrastructure.",
    included: ["Full Stack MERN Development", "Cloud & DevOps Engineering", "DSA with Python"],
    build: [
      { icon: React.createElement(Code, { className: "w-4 h-4" }), text: "Full Stack MERN Application" },
      { icon: React.createElement(Cloud, { className: "w-4 h-4" }), text: "Cloud Deployment Pipeline" }
    ],
    tags: ["MERN", "DevOps", "Cloud", "DSA"],
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Data Science & Analytics",
    description: "Extract business insights, run statistical modeling, build predictive classifiers, and create interactive BI dashboards.",
    included: ["Data Science, Machine Learning & Generative AI", "Data Analytics & Business Intelligence"],
    build: [
      { icon: React.createElement(Database, { className: "w-4 h-4" }), text: "Predictive Analytics Assistant" },
      { icon: React.createElement(PieChart, { className: "w-4 h-4" }), text: "Power BI Executive Dashboard" }
    ],
    tags: ["Python", "Machine Learning", "SQL", "Power BI"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "04",
    title: "Startup & Marketing OS",
    description: "Build startup MVPs, launch business models, write marketing campaigns, and analyze financial dashboards.",
    included: ["Startup & Entrepreneurship", "Digital Marketing & Growth Strategy", "Advanced Excel & Business Analytics"],
    build: [
      { icon: React.createElement(Rocket, { className: "w-4 h-4" }), text: "Startup Launch Blueprint" },
      { icon: React.createElement(PlayCircle, { className: "w-4 h-4" }), text: "Social & Ad Campaign Funnels" }
    ],
    tags: ["Entrepreneurship", "Marketing", "Excel", "MVP"],
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop"
  }
];
