'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card-bg)] mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span className="text-sm font-medium text-[var(--text-muted)]">Professional AI Platform</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[1.1] tracking-[-0.03em] text-balance"
        >
          <span className="text-foreground">
            Build Faster
          </span>
          <br />
          <span className="text-gradient">
            with AI Agents
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text-muted)] mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Intelligent agents, analytics, and cloud development environments for modern teams.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
        >
          <a
            href="https://calendly.com/joepro-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 btn-primary flex items-center justify-center gap-2"
            >
              Book Consultation
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </a>

          <Link href="/agents" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 btn-secondary flex items-center justify-center gap-2"
            >
              Try AI Agents
            </motion.button>
          </Link>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {[
            { name: 'Followlytics', url: 'https://followlytics.joepro.ai', desc: 'Social analytics & insights', icon: '📊' },
            { name: 'StakeSmith', url: 'https://stakesmith.joepro.ai', desc: 'AI investment analysis', icon: '💎' },
            { name: 'Neural Salvage', url: 'https://neuralsalvage.joepro.ai', desc: 'Data recovery tools', icon: '🔧' }
          ].map((service, i) => (
            <motion.a
              key={i}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] transition-all duration-200 hover:border-[var(--primary)] hover:shadow-lg relative overflow-hidden">
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center justify-between">
                  {service.name}
                  <ArrowRight className="w-4 h-4 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-[var(--text-muted)]">{service.desc}</p>
              </div>
            </motion.a>
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