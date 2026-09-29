import React from 'react';
import { Languages, Key } from 'lucide-react';

export default function Navbar({ onScrollTo }) {
  return (
    <nav class="sticky top-0 z-50 glass-card border-b border-slate-800 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            <Languages class="w-5 h-5" />
          </div>
          <span class="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Dynamic Translator API
          </span>
        </div>
        
        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button onClick={() => onScrollTo('playground')} class="hover:text-indigo-400 transition">Playground</button>
          <button onClick={() => onScrollTo('register')} class="hover:text-indigo-400 transition">Get API Key</button>
          <button onClick={() => onScrollTo('pricing')} class="hover:text-indigo-400 transition">Pricing</button>
          <button onClick={() => onScrollTo('docs')} class="hover:text-indigo-400 transition">Docs</button>
        </div>

        <div>
          <button 
            onClick={() => onScrollTo('register')} 
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Key class="w-4 h-4" /> Get Free Key
          </button>
        </div>
      </div>
    </nav>
  );
}
