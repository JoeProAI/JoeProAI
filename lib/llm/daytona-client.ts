// Daytona.io - Instant Dev Sandboxes

export interface SandboxTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  stack: string;
  repositoryUrl?: string;
}

export interface CreateSandboxRequest {
  template: string;
  name?: string;
  repositoryUrl?: string;
}

export interface Sandbox {
  id: string;
  url: string;
  template: string;
  createdAt: string;
}

// Pre-configured sandbox templates
export const SANDBOX_TEMPLATES: SandboxTemplate[] = [
  {
    id: 'node',
    name: 'Node.js',
    description: 'Node.js + npm/yarn',
    icon: '🟢',
    stack: 'node:20-alpine',
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Python 3.11 + pip',
    icon: '🐍',
    stack: 'python:3.11-slim',
  },
  {
    id: 'react',
    name: 'React',
    description: 'React + Vite + TypeScript',
    icon: '⚛️',
    stack: 'node:20',
    repositoryUrl: 'https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Next.js 14 + App Router',
    icon: '▲',
    stack: 'node:20',
    repositoryUrl: 'https://github.com/vercel/next.js/tree/canary/examples/hello-world',
  },
  {
    id: 'fullstack',
    name: 'Full Stack',
    description: 'Node + PostgreSQL + Redis',
    icon: '🚀',
    stack: 'node:20',
  },
  {
    id: 'ai',
    name: 'AI/ML',
    description: 'Python + Jupyter + TensorFlow',
    icon: '🤖',
    stack: 'python:3.11',
  },
];

// Generate instant sandbox URL using Daytona credits
export async function createInstantSandbox(request: CreateSandboxRequest): Promise<Sandbox> {
  const template = SANDBOX_TEMPLATES.find(t => t.id === request.template);
  
  if (!template) {
    throw new Error('Invalid template');
  }

  // Simulate sandbox creation
  // In production, this would call Daytona API with your credits
  const sandboxId = `sandbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: sandboxId,
    url: `https://${sandboxId}.daytona.dev`,
    template: request.template,
    createdAt: new Date().toISOString(),
  };
}