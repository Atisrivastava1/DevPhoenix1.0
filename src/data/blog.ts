export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  content: string; // Storing as HTML/Markdown string for now
}

export const blogPosts: BlogPost[] = [
  {
    slug: "building-ai-agents-with-n8n",
    title: "Building Autonomous AI Agents with n8n and OpenAI",
    excerpt: "A practical guide to replacing manual workflows with autonomous AI agents. Learn how we built a fully automated customer support triage system.",
    category: "AI & Automation",
    readTime: "8 min read",
    date: "October 12, 2023",
    author: {
      name: "DevPhoeniX Team",
      role: "Engineering",
      avatar: "/logo/devphoenix-logo.png",
    },
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    content: `
      <h2>The Shift to Autonomous Workflows</h2>
      <p>Automation is no longer just about moving data from point A to point B. It's about intelligent decision-making. By combining the visual logic of n8n with the reasoning capabilities of OpenAI, we can build agents that not only act, but think.</p>
      
      <h3>1. Defining the Agent's Purpose</h3>
      <p>Before touching any tool, define what the agent is supposed to do. In our case, it's reading incoming support emails, classifying their urgency, and drafting a context-aware response for human review.</p>

      <h3>2. Setting up the n8n Workflow</h3>
      <p>We use the IMAP node to listen for new emails. The payload is then passed to the OpenAI node, using the 'gpt-4' model with a strict system prompt.</p>

      <h3>3. The Prompt Engineering Layer</h3>
      <p>The success of the agent depends entirely on the prompt. You must provide it with examples of 'Urgent' vs 'Low Priority' and define the tone of the drafted response.</p>
    `,
  },
  {
    slug: "from-tutorial-hell-to-first-saas",
    title: "Escaping Tutorial Hell: How to Ship Your First SaaS",
    excerpt: "Stop watching videos and start building. A realistic roadmap for junior developers to launch their first revenue-generating micro-SaaS.",
    category: "Builder Journey",
    readTime: "6 min read",
    date: "November 05, 2023",
    author: {
      name: "DevPhoeniX Team",
      role: "Product",
      avatar: "/logo/devphoenix-logo.png",
    },
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    content: `
      <h2>Why We Get Stuck in Tutorial Hell</h2>
      <p>Tutorials give us a false sense of progress. We follow along, the code works, and we feel like we've learned something. But the moment we face a blank editor, panic sets in.</p>
      
      <h3>The Antidote: Problem-First Learning</h3>
      <p>To escape, you must stop learning technologies in isolation and start learning them as a means to solve a specific problem.</p>

      <h3>Step 1: Find a Micro-Problem</h3>
      <p>Don't try to build the next Facebook. Build a tool that converts CSVs to JSON for a specific niche, or a simple habit tracker for notion users.</p>

      <h3>Step 2: Timebox the MVP</h3>
      <p>Give yourself exactly 2 weeks to build the core functionality. No extra features. No perfect design. Just working logic.</p>
    `,
  }
];
