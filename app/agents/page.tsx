import { Metadata } from 'next';
import { Brain, Zap, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Agents - JoePro.ai',
  description: 'Create and manage custom AI agents with specialized capabilities.',
};

export default function AgentsPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="neon-text-purple">AI Agents</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Build custom AI agents with specialized prompts, models, and configurations.
            Deploy them for automated tasks and workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass neon-border-cyan rounded-xl p-6">
            <Brain className="w-12 h-12 text-neon-cyan mb-4" />
            <h3 className="text-xl font-bold text-neon-cyan mb-2">Custom Prompts</h3>
            <p className="text-gray-400">Define specialized system prompts for domain expertise</p>
          </div>
          
          <div className="glass neon-border-pink rounded-xl p-6">
            <Zap className="w-12 h-12 text-neon-pink mb-4" />
            <h3 className="text-xl font-bold text-neon-pink mb-2">Multi-Model</h3>
            <p className="text-gray-400">Choose between OpenAI, xAI, and other providers</p>
          </div>
          
          <div className="glass neon-border-purple rounded-xl p-6">
            <Settings className="w-12 h-12 text-neon-purple mb-4" />
            <h3 className="text-xl font-bold text-neon-purple mb-2">Fine-Tuned</h3>
            <p className="text-gray-400">Adjust temperature, tools, and execution parameters</p>
          </div>
        </div>

        <div className="glass neon-border-cyan rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-neon-cyan mb-4">Agent Builder Coming Soon</h2>
          <p className="text-gray-400 mb-6">
            The visual agent builder is under development. Use the API endpoints to create and run agents programmatically.
          </p>
          <div className="inline-block bg-cyber-gray rounded-lg p-4 text-left">
            <code className="text-sm text-neon-green">
              POST /api/agents/run<br/>
              {'{'} "agentId": "...", "userMessage": "..." {'}'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
