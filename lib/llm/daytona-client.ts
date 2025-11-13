// Daytona.io Cloud Development Environment Integration

export interface DaytonaConfig {
  apiKey?: string;
  baseURL?: string;
}

export interface DaytonaWorkspace {
  id: string;
  name: string;
  repositoryUrl?: string;
  status: 'creating' | 'running' | 'stopped' | 'error';
  url?: string;
  createdAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  repositoryUrl?: string;
  branch?: string;
  image?: string;
}

export function getDaytonaClient(config?: DaytonaConfig) {
  const apiKey = config?.apiKey || process.env.DAYTONA_TOKEN;
  
  if (!apiKey) {
    throw new Error('DAYTONA_TOKEN is not configured');
  }
  
  return {
    apiKey,
    baseURL: config?.baseURL || 'https://api.daytona.io/v1',
  };
}

async function daytonaFetch(endpoint: string, options: RequestInit = {}) {
  const client = getDaytonaClient();
  
  const response = await fetch(`${client.baseURL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${client.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Daytona API error: ${response.status} ${error}`);
  }

  return response.json();
}

export async function createWorkspace(request: CreateWorkspaceRequest): Promise<DaytonaWorkspace> {
  return daytonaFetch('/workspaces', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function listWorkspaces(): Promise<DaytonaWorkspace[]> {
  return daytonaFetch('/workspaces');
}

export async function getWorkspace(workspaceId: string): Promise<DaytonaWorkspace> {
  return daytonaFetch(`/workspaces/${workspaceId}`);
}

export async function deleteWorkspace(workspaceId: string): Promise<void> {
  return daytonaFetch(`/workspaces/${workspaceId}`, {
    method: 'DELETE',
  });
}

export async function startWorkspace(workspaceId: string): Promise<DaytonaWorkspace> {
  return daytonaFetch(`/workspaces/${workspaceId}/start`, {
    method: 'POST',
  });
}

export async function stopWorkspace(workspaceId: string): Promise<DaytonaWorkspace> {
  return daytonaFetch(`/workspaces/${workspaceId}/stop`, {
    method: 'POST',
  });
}

export async function getAccountInfo() {
  return daytonaFetch('/account');
}