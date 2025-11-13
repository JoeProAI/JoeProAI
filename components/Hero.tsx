'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Zap, Brain } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border-cyan mb-8"
        >
          <Sparkles className="w-4 h-4 text-neon-cyan animate-pulse" />
          <span className="text-sm font-medium text-neon-cyan">AI-Powered Innovation Hub</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="neon-text-pink">Joe</span>
          <span className="neon-text-cyan">Pro</span>
          <span className="text-white">.ai</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Your cyberpunk gateway to cutting-edge AI tools, custom agents, 
          and real-time tech intelligence. Built for creators, developers, and innovators.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/apps">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-purple rounded-lg font-semibold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-neon-pink">
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Explore Apps
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </Link>

          <Link href="/agents">
            <button className="group px-8 py-4 glass neon-border-cyan rounded-lg font-semibold text-neon-cyan transition-all hover:scale-105 hover:shadow-neon-cyan">
              <span className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Launch Agents
              </span>
            </button>
          </Link>

          <Link href="/feeds">
            <button className="group px-8 py-4 glass border border-gray-700 rounded-lg font-semibold text-gray-300 transition-all hover:scale-105 hover:border-neon-purple hover:text-neon-purple">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Tech Feeds
              </span>
            </button>
          </Link>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex flex-wrap gap-3 justify-center"
        >
          {['🤖 OpenAI', '⚡ xAI', '🧠 Custom Agents', '📡 Live Feeds', '🎨 Cyberpunk UI'].map((feature, i) => (
            <span
              key={i}
              className="px-4 py-2 glass rounded-full text-sm text-gray-400 border border-gray-800 hover:border-neon-cyan hover:text-neon-cyan transition-all cursor-default"
            >
              {feature}
            </span>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-700 rounded-full flex items-start justify-center p-2"
            >
              <div className="w-1 h-2 bg-neon-cyan rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}