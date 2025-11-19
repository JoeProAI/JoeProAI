// Daytona.io - Instant Dev Sandboxes
// REAL Implementation Guide: See DAYTONA_IMPLEMENTATION.md

// To use real Daytona SDK:
// 1. npm install @daytonaio/sdk
// 2. Create snapshots in dashboard for each template
// 3. Uncomment the SDK import below
// 4. Use the real launchSandbox function

import { Daytona } from '@daytonaio/sdk';

// Lazy initialize Daytona client to avoid build-time errors
let daytonaClient: Daytona | null = null;

function getDaytonaClient(): Daytona {
  if (!daytonaClient) {
    const apiKey = process.env.DAYTONA_TOKEN;
    if (!apiKey) {
      throw new Error('DAYTONA_TOKEN environment variable is not set');
    }
    daytonaClient = new Daytona({ apiKey });
  }
  return daytonaClient;
}

export interface SandboxTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  stack: string;
  snapshotName: string; // Actual snapshot name in Daytona dashboard
}

export interface CreateSandboxRequest {
  template: string;
  name?: string;
  repositoryUrl?: string;
}

export interface Sandbox {
  id: string;
  url: string;
  token?: string; // Auth token for preview URL
  template: string;
  createdAt: string;
}

// Pre-configured sandbox templates
// Create these snapshots in your Daytona dashboard first!
export const SANDBOX_TEMPLATES: SandboxTemplate[] = [
  {
    id: 'node',
    name: 'Node.js',
    description: 'Node.js + npm/yarn',
    icon: '🟢',
    stack: 'node:20-alpine',
    snapshotName: 'daytona-small', // Create this snapshot in dashboard
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Python 3.11 + pip',
    icon: '🐍',
    stack: 'python:3.11-slim',
    snapshotName: 'daytona-small',
  },
  {
    id: 'react',
    name: 'React',
    description: 'React + Vite + TypeScript',
    icon: '⚛️',
    stack: 'node:20',
    snapshotName: 'daytona-medium',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Next.js 14 + App Router',
    icon: '▲',
    stack: 'node:20',
    snapshotName: 'daytona-medium',
  },
  {
    id: 'fullstack',
    name: 'Full Stack',
    description: 'Node + PostgreSQL + Redis',
    icon: '🚀',
    stack: 'node:20',
    snapshotName: 'daytona-large',
  },
  {
    id: 'ai',
    name: 'AI/ML',
    description: 'Python + Jupyter + TensorFlow',
    icon: '🤖',
    stack: 'python:3.11',
    snapshotName: 'daytona-large',
  },
];

// REAL SDK Implementation - ACTIVE
export async function createInstantSandbox(request: CreateSandboxRequest): Promise<Sandbox> {
  const template = SANDBOX_TEMPLATES.find(t => t.id === request.template);
  
  if (!template) {
    throw new Error('Invalid template');
  }

  // Get lazy-loaded client
  const client = getDaytonaClient();

  // Create sandbox from pre-configured snapshot
  const sandbox = await client.create({
    snapshot: template.snapshotName,
    name: request.name || `joepro-${request.template}-${Date.now()}`,
    public: true, // Anyone with link can access (no auth needed)
  });

  // Get preview URL for VS Code IDE (port 3000 is common)
  const preview = await sandbox.getPreviewLink(3000);
  
  return {
    id: sandbox.id,
    url: preview.url, // Real Daytona URL: https://3000-sandbox-xxx.proxy.daytona.work
    token: preview.token, // Auth token (not needed if public=true)
    template: request.template,
    createdAt: new Date().toISOString(),
  };
}
