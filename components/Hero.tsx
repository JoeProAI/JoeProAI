'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-2 glass mb-8 text-sm font-medium"
        >
          <span className="text-secondary dark:text-slate-300">AI-Powered Platform</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-gradient">JoePro</span>
          <span className="text-foreground">.ai</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-secondary dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Build smarter with AI. Access OpenAI and xAI models, create custom agents, 
          and stay updated with real-time tech feeds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/apps/chat" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-10 py-4 bg-primary hover:bg-blue-700 text-white font-medium transition-all hover:shadow-lg">
              Get Started
            </button>
          </Link>

          <Link href="/agents" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-10 py-4 glass card-border hover:card-border-hover font-medium transition-all">
              AI Agents
            </button>
          </Link>

          <Link href="/feeds" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-10 py-4 glass card-border hover:card-border-hover font-medium transition-all">
              Tech Feeds
            </button>
          </Link>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex flex-wrap gap-3 justify-center"
        >
          {['OpenAI', 'xAI (Grok)', 'Custom Agents', 'RSS Feeds', 'Real-time Data'].map((feature, i) => (
            <span
              key={i}
              className="px-4 py-2 glass rounded-full text-sm text-secondary dark:text-slate-400 card-border"
            >
              {feature}
            </span>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-secondary dark:text-slate-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}