import { Metadata } from 'next';
import GlowCard from '@/components/GlowCard';
import { Brain, MessageSquare, Image, Code, Zap, Sparkles, Database, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Apps - JoePro.ai',
  description: 'Explore our collection of cutting-edge AI applications and tools.',
};

// Force dynamic rendering to avoid build timeout with client components
export const dynamic = 'force-dynamic';

const apps = [
  {
    title: 'Chat AI',
    description: 'Conversational AI powered by OpenAI and xAI. Multi-model support with streaming responses.',
    icon: MessageSquare,
    href: '/apps/chat',
    color: 'cyan' as const,
  },
  {
    title: 'Image Generator',
    description: 'Create stunning images from text prompts using state-of-the-art diffusion models.',
    icon: Image,
    href: '/apps/image-gen',
    color: 'pink' as const,
  },
  {
    title: 'Code Assistant',
    description: 'AI-powered code generation, debugging, and optimization for multiple languages.',
    icon: Code,
    href: '/apps/code',
    color: 'purple' as const,
  },
  {
    title: 'Custom Agents',
    description: 'Build and deploy specialized AI agents with custom prompts and configurations.',
    icon: Brain,
    href: '/agents',
    color: 'green' as const,
  },
  {
    title: 'Data Analyzer',
    description: 'Upload and analyze datasets with AI-powered insights and visualizations.',
    icon: Database,
    href: '/apps/data',
    color: 'cyan' as const,
  },
  {
    title: 'Web Scraper',
    description: 'Extract and analyze web content with intelligent parsing and summarization.',
    icon: Globe,
    href: '/apps/scraper',
    color: 'pink' as const,
  },
  {
    title: 'Prompt Studio',
    description: 'Design, test, and optimize prompts for maximum AI performance.',
    icon: Sparkles,
    href: '/apps/prompts',
    color: 'purple' as const,
  },
  {
    title: 'API Playground',
    description: 'Test and experiment with OpenAI, xAI, and other AI APIs in real-time.',
    icon: Zap,
    href: '/apps/api',
    color: 'green' as const,
  },
];

export default function AppsPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="neon-text-cyan">AI Apps</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore our collection of cutting-edge AI applications. 
            Each tool is designed for maximum performance and ease of use.
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app, index) => (
            <GlowCard
              key={index}
              title={app.title}
              description={app.description}
              icon={app.icon}
              href={app.href}
              color={app.color}
            />
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-20 text-center">
          <div className="inline-block glass neon-border-purple rounded-xl p-8">
            <h2 className="text-2xl font-bold text-neon-purple mb-2">More Apps Coming Soon</h2>
            <p className="text-gray-400">
              We're constantly building new AI tools. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}