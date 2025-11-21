"use client";

import React, { useState } from 'react';
import AppCard from '@/components/apps/AppCard';
import ChatInterface from '@/components/apps/ChatInterface';
import NanoBanana from '@/components/apps/NanoBanana';

export default function AppsPage() {
  const [activeApp, setActiveApp] = useState<string | null>(null);

  return (
    <main className="min-h-screen p-8 md:p-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-neon-cyan/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan animate-glow">
              JoePro Apps
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experimental tools, AI interfaces, and digital toys from the future.
          </p>
        </header>

        {/* Featured Apps / Active App View */}
        {activeApp ? (
          <div className="mb-16 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {activeApp === 'chat' ? 'Gork 4.1-fast' : 'Nano Banana'}
              </h2>
              <button
                onClick={() => setActiveApp(null)}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:border-neon-pink hover:text-neon-pink transition-colors"
              >
                Close App
              </button>
            </div>

            <div className="bg-cyber-dark/50 backdrop-blur-xl rounded-2xl p-1 border border-white/10 shadow-2xl">
              {activeApp === 'chat' && <ChatInterface />}
              {activeApp === 'banana' && <NanoBanana />}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AppCard
              title="Gork 4.1-fast"
              description="Advanced conversational AI with attitude. Real-time processing and neural optimization."
              icon="🤖"
              color="cyan"
              onClick={() => setActiveApp('chat')}
            />

            <AppCard
              title="Nano Banana"
              description="Digital stress relief. Click the banana. Watch it dance. Question your life choices."
              icon="🍌"
              color="yellow"
              onClick={() => setActiveApp('banana')}
            />

            <AppCard
              title="System Monitor"
              description="Real-time metrics of the JoePro network. (Coming Soon)"
              icon="📊"
              color="green"
              href="#"
            />

            <AppCard
              title="Neural Painter"
              description="Generate art using pure thought waves. (Coming Soon)"
              icon="🎨"
              color="pink"
              href="#"
            />
          </div>
        )}
      </div>
    </main>
  );
}