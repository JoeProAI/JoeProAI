import { Metadata } from 'next';
import { Rss, ExternalLink, Clock } from 'lucide-react';
import { FEED_SOURCES } from '@/lib/feeds/sources';
import { fetchFeeds } from '@/lib/feeds/scraper';

export const metadata: Metadata = {
  title: 'Tech Feeds - JoePro.ai',
  description: 'Real-time tech news from top sources',
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function FeedsPage() {
  const feeds = await fetchFeeds().catch(() => []);
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Tech News Feed
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real-time technology news from {FEED_SOURCES.length} top sources • {feeds.length} articles
          </p>
        </div>

        {feeds.length > 0 ? (
          <div className="space-y-4">
            {feeds.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {item.source}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.published).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {item.category && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                            {item.category}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h2>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Rss className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Feeds...</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Aggregating news from {FEED_SOURCES.length} sources
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
