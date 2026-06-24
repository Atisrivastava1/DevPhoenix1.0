"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink, Layers, Zap } from "lucide-react";
import { Program } from "@/types";
import { designSystem } from "@/lib/design-system";

// ─── Static project blueprints per program slug ────────────────────────────────
// These enrich the experience if the DB doesn't have per-program project data.
const PROGRAM_PROJECTS: Record<string, { title: string; description: string; tools: string[]; difficulty: 'Starter' | 'Intermediate' | 'Advanced'; gradient: string }[]> = {
  "full-stack-development": [
    { title: "AI SaaS Dashboard", description: "A production-grade multi-tenant SaaS with authentication, billing, and real-time analytics.", tools: ["Next.js", "Supabase", "Stripe", "Tailwind"], difficulty: "Advanced", gradient: "from-blue-500/10 to-indigo-500/10" },
    { title: "Real-time Chat App", description: "WhatsApp-like messaging with live rooms, file sharing, and read receipts.", tools: ["React", "Socket.io", "Node.js", "Redis"], difficulty: "Intermediate", gradient: "from-green-500/10 to-teal-500/10" },
    { title: "Portfolio OS", description: "A dynamic personal portfolio with CMS admin panel and project showcase.", tools: ["Next.js", "Prisma", "PostgreSQL"], difficulty: "Intermediate", gradient: "from-orange-500/10 to-red-500/10" },
    { title: "E-commerce API", description: "Full backend with product management, carts, orders, and payment integration.", tools: ["Node.js", "Express", "MongoDB", "Razorpay"], difficulty: "Advanced", gradient: "from-purple-500/10 to-pink-500/10" },
  ],
  "cloud-computing": [
    { title: "3-Tier AWS Architecture", description: "Deploy a scalable app using EC2, RDS, and ALB with auto-scaling groups.", tools: ["AWS EC2", "RDS", "ALB", "CloudFormation"], difficulty: "Advanced", gradient: "from-yellow-500/10 to-orange-500/10" },
    { title: "Serverless API Platform", description: "Build a fully serverless backend with Lambda, API Gateway, and DynamoDB.", tools: ["Lambda", "API Gateway", "DynamoDB", "S3"], difficulty: "Intermediate", gradient: "from-blue-500/10 to-cyan-500/10" },
    { title: "CI/CD Pipeline", description: "End-to-end deployment pipeline from GitHub to production using AWS CodePipeline.", tools: ["CodePipeline", "CodeBuild", "ECR", "ECS"], difficulty: "Intermediate", gradient: "from-green-500/10 to-emerald-500/10" },
  ],
  "ai-automation": [
    { title: "AI Support Bot", description: "Autonomous customer support agent that reads emails, classifies urgency, and drafts responses.", tools: ["n8n", "OpenAI", "Gmail API", "Notion"], difficulty: "Intermediate", gradient: "from-violet-500/10 to-purple-500/10" },
    { title: "Content Pipeline", description: "AI-powered content factory that researches topics, writes drafts, and schedules posts.", tools: ["n8n", "GPT-4", "Buffer API", "Airtable"], difficulty: "Intermediate", gradient: "from-pink-500/10 to-rose-500/10" },
    { title: "Document QA System", description: "Upload any PDF and ask questions — powered by RAG and vector search.", tools: ["LangChain", "Pinecone", "OpenAI", "Streamlit"], difficulty: "Advanced", gradient: "from-blue-500/10 to-indigo-500/10" },
    { title: "WhatsApp Lead Bot", description: "Automated lead qualification bot over WhatsApp with CRM insertion.", tools: ["WhatsApp API", "n8n", "Airtable", "OpenAI"], difficulty: "Advanced", gradient: "from-green-500/10 to-teal-500/10" },
  ],
  "data-analytics": [
    { title: "Sales Analytics Dashboard", description: "Interactive Power BI dashboard with KPIs, trends, and drill-down reports.", tools: ["Power BI", "SQL", "Excel", "DAX"], difficulty: "Intermediate", gradient: "from-orange-500/10 to-amber-500/10" },
    { title: "Customer Churn Predictor", description: "ML model that predicts customer churn from behavioral data with 85%+ accuracy.", tools: ["Python", "Scikit-learn", "Pandas", "Matplotlib"], difficulty: "Advanced", gradient: "from-blue-500/10 to-cyan-500/10" },
    { title: "E-commerce Data Pipeline", description: "ETL pipeline that transforms raw sales data into business intelligence.", tools: ["Python", "PostgreSQL", "Power Query", "Excel"], difficulty: "Intermediate", gradient: "from-green-500/10 to-teal-500/10" },
  ],
};

// Generic fallback for programs without custom project blueprints
const GENERIC_PROJECTS = [
  { title: "Capstone Project 1", description: "A real-world application combining all skills learned in the first half of the program.", tools: [], difficulty: "Intermediate" as const, gradient: "from-orange-500/10 to-amber-500/10" },
  { title: "Capstone Project 2", description: "A portfolio-grade project built under mentor supervision, ready to show employers.", tools: [], difficulty: "Advanced" as const, gradient: "from-blue-500/10 to-indigo-500/10" },
  { title: "Industry Challenge", description: "Solve a real business problem pitched by an industry partner company.", tools: [], difficulty: "Advanced" as const, gradient: "from-purple-500/10 to-pink-500/10" },
];

const DIFFICULTY_COLORS = {
  Starter: 'bg-green-100 text-green-700 border-green-200',
  Intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
  Advanced: 'bg-orange-100 text-orange-700 border-orange-200',
};

interface ProgramProjectsProps {
  program: Program;
}

export function ProgramProjects({ program }: ProgramProjectsProps) {
  const projects = PROGRAM_PROJECTS[program.slug] || GENERIC_PROJECTS;

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full mb-4">
            <Layers className="w-3.5 h-3.5" /> Hands-on Projects
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            Projects You&apos;ll Build
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Every project is production-grade and portfolio-ready. You don&apos;t just learn — you ship.
          </p>
        </motion.div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`relative group bg-gradient-to-br ${project.gradient} border border-slate-100 rounded-2xl p-6 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300`}
            >
              {/* Difficulty badge */}
              <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border mb-4 ${DIFFICULTY_COLORS[project.difficulty]}`}>
                <Zap className="w-3 h-3 mr-1" /> {project.difficulty}
              </span>

              <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{project.description}</p>

              {/* Tech stack */}
              {project.tools.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tools.map(tool => (
                    <span key={tool} className="flex items-center gap-1 text-xs bg-white/80 border border-slate-200 text-slate-600 font-semibold px-2.5 py-1 rounded-lg">
                      <Code2 className="w-3 h-3 text-orange-400" /> {tool}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 text-sm mb-4">
            All projects are peer-reviewed by mentors and added to your portfolio upon completion.
          </p>
          <button
            onClick={() => document.getElementById('program-lead-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-orange-500 text-white font-bold text-sm transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" /> Get Full Project List
          </button>
        </motion.div>
      </div>
    </section>
  );
}
