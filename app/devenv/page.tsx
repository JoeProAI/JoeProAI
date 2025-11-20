'use client';

import { useState } from 'react';
import { Rocket, Zap, ExternalLink, Sparkles } from 'lucide-react';

interface SandboxTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  stack: string;
}

interface LaunchedSandbox {
  id: string;
  url: string;
  template: string;
  createdAt: string;
}

const TEMPLATES: SandboxTemplate[] = [
  {
    id: 'node',
    name: 'Node.js',
    description: 'Node.js + npm/yarn',
    icon: 'box',
    stack: 'node:20-alpine',
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Python 3.11 + pip',
    icon: 'code',
    stack: 'python:3.11-slim',
  },
  {
    id: 'react',
    name: 'React',
    description: 'React + Vite + TypeScript',
    icon: 'component',
    stack: 'node:20',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Next.js 14 + App Router',
    icon: 'layers',
    stack: 'node:20',
  },
  {
    id: 'fullstack',
    name: 'Full Stack',
    description: 'Node + PostgreSQL + Redis',
    icon: 'server',
    stack: 'node:20',
  },
  {
    id: 'ai',
    name: 'AI/ML',
    description: 'Python + Jupyter + TensorFlow',
    icon: 'cpu',
    stack: 'python:3.11',
  },
];

export default function SandboxLauncher() {
  const [launching, setLaunching] = useState<string | null>(null);
  const [launched, setLaunched] = useState<LaunchedSandbox | null>(null);
  const [error, setError] = useState<string | null>(null);

  const launchSandbox = async (templateId: string) => {
    setLaunching(templateId);
    setError(null);
    
    try {
      const response = await fetch('/api/daytona/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: templateId })
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        console.error('API Error:', data);
        return;
      }
      
      if (data.sandbox) {
        setLaunched(data.sandbox);
        // Store sandbox data in sessionStorage for launch page
        sessionStorage.setItem(`sandbox-${data.sandbox.id}`, JSON.stringify(data.sandbox));
        // Redirect to launch page after 2 seconds
        setTimeout(() => {
          window.location.href = `/sandbox/${data.sandbox.id}`;
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMsg);
      console.error('Launch failed:', error);
    } finally {
      setLaunching(null);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Powered by 20,000 Daytona Credits</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Instant Dev Sandboxes
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Launch fully-configured development environments in seconds. 
            <br />
            <span className="font-semibold">No setup. No waiting. Just code.</span>
          </p>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Instant Launch</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-blue-500" />
              <span>Pre-configured Stacks</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-purple-500" />
              <span>VS Code Browser IDE</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-12 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl p-6 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-1">
                  Launch Failed
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                  {error}
                </p>
                <button
                  onClick={() => setError(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Launch Success Message */}
        {launched && (
          <div className="mb-12 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
                  Sandbox Launched Successfully
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                  Your environment is ready. Opening in new tab...
                </p>
                <a
                  href={launched.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Sandbox
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="text-6xl mb-4">{template.icon}</div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {template.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-6 font-mono">
                {template.stack}
              </div>

              {/* Launch Button */}
              <button
                onClick={() => launchSandbox(template.id)}
                disabled={launching !== null}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  launching === template.id
                    ? 'bg-blue-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {launching === template.id ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Launch Sandbox
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-3xl">
              <div>
                <div className="text-3xl mb-2">1️⃣</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Choose Template</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pick your stack - Node, Python, React, or more
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">2️⃣</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Launch Instantly</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click launch - sandbox spins up in seconds
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">3️⃣</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Start Coding</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Full VS Code IDE in your browser, ready to go
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
