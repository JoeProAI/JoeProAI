'use client';

import { useState, useEffect } from 'react';
import { Code2, Play, Square, Trash2, Plus, ExternalLink, Loader2 } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  repositoryUrl?: string;
  status: 'creating' | 'running' | 'stopped' | 'error';
  url?: string;
  createdAt: string;
}

export default function DevEnvPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    repositoryUrl: '',
    branch: 'main'
  });

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/daytona/workspaces');
      const data = await response.json();
      setWorkspaces(data.workspaces || []);
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async () => {
    if (!newWorkspace.name) return;
    
    setCreating(true);
    try {
      const response = await fetch('/api/daytona/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkspace)
      });

      if (response.ok) {
        setNewWorkspace({ name: '', repositoryUrl: '', branch: 'main' });
        setShowCreate(false);
        fetchWorkspaces();
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                Dev Environments
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Cloud workspaces powered by Daytona • 20,000 credits available
              </p>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Workspace
            </button>
          </div>

          {/* Create Form */}
          {showCreate && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Development Workspace</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Workspace Name *
                  </label>
                  <input
                    type="text"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                    placeholder="my-awesome-project"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Git Repository URL (optional)
                  </label>
                  <input
                    type="text"
                    value={newWorkspace.repositoryUrl}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, repositoryUrl: e.target.value })}
                    placeholder="https://github.com/username/repo.git"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={newWorkspace.branch}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, branch: e.target.value })}
                    placeholder="main"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={createWorkspace}
                    disabled={creating || !newWorkspace.name}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Create Workspace
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Workspaces List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : workspaces.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Workspaces Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first cloud development environment to get started.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{workspace.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        workspace.status === 'running' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        workspace.status === 'creating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        workspace.status === 'stopped' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {workspace.status}
                      </span>
                    </div>
                  </div>
                </div>

                {workspace.repositoryUrl && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 truncate">
                    {workspace.repositoryUrl}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  {workspace.status === 'running' && workspace.url && (
                    <a
                      href={workspace.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </a>
                  )}
                  {workspace.status === 'stopped' && (
                    <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  )}
                  {workspace.status === 'running' && (
                    <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-colors">
                      <Square className="w-4 h-4" />
                    </button>
                  )}
                  <button className="px-4 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-300 text-sm font-medium rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ⚡ Powered by Daytona.io
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Spin up cloud development environments in seconds. Full VS Code experience with your own credits.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Credits Available:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">20,000</span>
            </div>
            <a
              href="https://daytona.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Learn more about Daytona
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
