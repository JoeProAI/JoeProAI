import { Metadata } from 'next';
import { Rss, ExternalLink, Clock } from 'lucide-react';
import { FEED_SOURCES } from '@/lib/feeds/sources';

export const metadata: Metadata = {
  title: 'Tech Feeds - JoePro.ai',
  description: 'Real-time tech news from top sources',
};

export default function FeedsPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="neon-text-green">Tech Feeds</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real-time technology news aggregated from {FEED_SOURCES.length} top sources.
            Stay updated with the latest in AI, startups, and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {FEED_SOURCES.map((source, index) => (
            <div key={index} className="glass neon-border-green rounded-xl p-6 hover:shadow-neon-green transition-all">
              <div className="flex items-start gap-4">
                <Rss className="w-8 h-8 text-neon-green flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-neon-green mb-1">{source.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{source.description}</p>
                  <span className="inline-block px-2 py-1 bg-cyber-gray rounded text-xs text-gray-500">
                    {source.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass neon-border-cyan rounded-xl p-8 text-center">
          <Clock className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neon-cyan mb-4">Live Feed Coming Soon</h2>
          <p className="text-gray-400 mb-6">
            The live feed aggregator is being built. Access feeds via API endpoint:
          </p>
          <div className="inline-block bg-cyber-gray rounded-lg p-4">
            <code className="text-sm text-neon-green">GET /api/feeds</code>
          </div>
          <div className="mt-6">
            <a 
              href="/api/feeds" 
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 glass neon-border-cyan rounded-lg text-neon-cyan hover:shadow-neon-cyan transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              View API Response
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
