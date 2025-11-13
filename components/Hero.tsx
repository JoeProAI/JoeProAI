'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sparkles, Zap, TrendingUp, Brain } from 'lucide-react';

export default function Hero() {
  const [stats, setStats] = useState({ models: 0, agents: 0, queries: 0 });

  useEffect(() => {
    // Animate counters
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        models: Math.floor(progress * 12),
        agents: Math.floor(progress * 500),
        queries: Math.floor(progress * 10000)
      });
      if (step >= steps) clearInterval(timer);
    }, increment);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="inline-flex items-center gap-2 px-6 py-3 mb-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 clip-corners blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 clip-corners" />
          <Sparkles className="w-5 h-5 text-blue-400 relative z-10" />
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative z-10">Next-Gen AI Platform</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl md:text-9xl font-black mb-8 leading-none tracking-tighter"
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ backgroundSize: '200%' }}
          >
            JoePro
          </motion.span>
          <span className="text-white">.ai</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-secondary dark:text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          Premium AI Platform for Professionals
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base md:text-lg text-secondary dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Harness GPT-4, Grok, and custom AI agents with vision & analytics.
          <br />Built for developers, creators, and innovators who demand excellence.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link href="/apps/chat" className="group w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="relative w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg clip-corners overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Launch Chat
              </span>
            </motion.button>
          </Link>

          <Link href="/agents" className="group w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-full sm:w-auto px-12 py-5 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-black text-lg clip-corners hover:bg-white/10 transition-all"
            >
              <span className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Agents
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-16"
        >
          {[
            { icon: Brain, label: 'AI Models', value: stats.models, suffix: '+' },
            { icon: TrendingUp, label: 'Active Agents', value: stats.agents, suffix: '+' },
            { icon: Zap, label: 'Queries/Day', value: stats.queries, suffix: '+' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 clip-corners blur-sm group-hover:blur-md transition-all" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 clip-corners p-6 group-hover:border-white/30 transition-all">
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
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
              className="px-4 py-2 glass clip-corners text-sm text-secondary dark:text-slate-400 card-border"
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