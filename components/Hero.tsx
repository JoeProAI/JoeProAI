'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, TrendingUp, Database, BarChart3 } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 z-10">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center gap-3 px-6 py-2 mb-8 relative border-2 border-cyan-400"
          style={{
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1))',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.4), inset 0 0 20px rgba(0, 212, 255, 0.1)'
          }}
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold tracking-widest uppercase text-gradient">GROK INSIDE</span>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-20"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Particles spell out text in background - no static headline needed */}
        
        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-[var(--text-muted)] mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          AI agents, live analytics, and instant cloud environments. <br className="hidden md:block" />
          <span className="text-foreground font-semibold">Zero configuration. Maximum velocity.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
        >
          <a
            href="https://calendly.com/joepro-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto group"
          >
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 btn-primary flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <span className="relative z-10">Start Building</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </a>

          <Link href="/devenv" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 btn-secondary flex items-center justify-center gap-2"
            >
              Launch Sandbox
              <Zap className="w-4 h-4" />
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
            { name: 'Followlytics', url: 'https://followlytics.joepro.ai', desc: 'Real-time social analytics', Icon: BarChart3 },
            { name: 'StakeSmith', url: 'https://stakesmith.joepro.ai', desc: 'AI investment insights', Icon: TrendingUp },
            { name: 'Neural Salvage', url: 'https://neuralsalvage.joepro.ai', desc: 'Data recovery platform', Icon: Database }
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
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] transition-all duration-300 hover:border-[var(--primary)] hover:shadow-lg relative overflow-hidden group-hover:translate-x-1">
                {/* Animated gradient on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 group-hover:opacity-10"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative z-10">
                  <service.Icon className="w-8 h-8 mb-4 text-[var(--primary)]" strokeWidth={1.5} />
                  <h3 className="text-lg font-bold text-foreground mb-2 flex items-center justify-between">
                    {service.name}
                    <motion.div
                      initial={{ x: -4, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                    >
                      <ArrowRight className="w-4 h-4 text-[var(--primary)]" />
                    </motion.div>
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] font-medium">{service.desc}</p>
                </div>
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