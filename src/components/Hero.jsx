import React from 'react';
import { Play, Key, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ onScrollTo }) {
  return (
    <header class="gradient-bg py-24 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" style={{ animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        class="max-w-5xl mx-auto text-center relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-indigo-300 text-xs font-semibold mb-6 border border-indigo-500/30"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          React 18 Commercial Portal • 100+ Languages Supported
        </motion.div>

        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Ultra-Fast Translation API for <br />
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Flutter, Mobile & Web Apps
          </span>
        </h1>

        <p class="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Localize your applications dynamically with a single line of code. Instant API Keys with 5,000 free words/month. No complex Cloud billing setup required.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onScrollTo('playground')}
            class="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-bold text-white shadow-xl glow-effect transition flex items-center justify-center gap-2"
          >
            <Play class="w-4 h-4 fill-white" /> Try Live Playground
          </button>
          
          <button 
            onClick={() => onScrollTo('register')}
            class="px-8 py-4 rounded-xl glass-card hover:bg-slate-800 font-bold text-slate-200 border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <Key class="w-4 h-4 text-indigo-400" /> Claim Free API Key
          </button>
        </div>
      </motion.div>
    </header>
  );
}
