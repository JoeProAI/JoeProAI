'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ExternalLink, Loader2, AlertCircle } from 'lucide-react';

export default function SandboxLaunchPage() {
  const params = useParams();
  const [sandboxData, setSandboxData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get sandbox data from sessionStorage (set by the devenv page)
    const stored = sessionStorage.getItem(`sandbox-${params.id}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSandboxData(data);
      } catch (e) {
        setError('Failed to load sandbox data');
      }
    } else {
      setError('Sandbox not found. Please launch it again from the Dev Environment page.');
    }
  }, [params.id]);

  const handleOpenSandbox = () => {
    if (sandboxData?.url) {
      // Open in new tab - user will see Daytona's warning page first time only
      window.open(sandboxData.url, '_blank');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Oops!</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <a
            href="/devenv"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Dev Environment
          </a>
        </div>
      </div>
    );
  }

  if (!sandboxData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-card-bg border border-border rounded-2xl p-8 shadow-xl">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-center mb-3">
            Sandbox Ready! 🚀
          </h1>
          
          <p className="text-center text-muted-foreground mb-8">
            Your <strong>{sandboxData.template}</strong> development environment is live and ready to use.
          </p>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-400 mb-1">First-time security notice</p>
                <p className="text-blue-300/80">
                  Daytona will show a security warning the first time you access this sandbox. 
                  This is normal and helps protect you from malicious code. Click "Continue" to proceed.
                </p>
              </div>
            </div>
          </div>

          {/* Sandbox Details */}
          <div className="space-y-3 mb-6 bg-background/50 rounded-lg p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Sandbox ID:</span>
              <code className="text-xs bg-background px-2 py-1 rounded font-mono">
                {sandboxData.id}
              </code>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Template:</span>
              <span className="font-semibold">{sandboxData.template}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-400 font-semibold">● Live</span>
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={handleOpenSandbox}
            className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-3 group"
          >
            <span>Open Sandbox</span>
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Direct Link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">Or copy the direct link:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={sandboxData.url}
                readOnly
                className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded font-mono"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sandboxData.url);
                }}
                className="px-4 py-2 bg-secondary text-white rounded text-xs hover:bg-secondary/80 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/devenv"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Dev Environment
          </a>
        </div>
      </div>
    </div>
  );
}
