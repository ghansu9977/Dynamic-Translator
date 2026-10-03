import React, { useState, useEffect } from 'react';
import { Languages, Key, Menu, X, LayoutDashboard } from 'lucide-react';

export default function Navbar({ onScrollTo }) {
  const [hasKey, setHasKey] = useState(false);
  
  useEffect(() => {
    if (localStorage.getItem("dt_user_api_key")) {
      setHasKey(true);
    }
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (id) => {
    setIsOpen(false);
    onScrollTo(id);
  };

  return (
    <nav class="sticky top-0 z-50 glass-card border-b border-slate-800 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            <Languages class="w-5 h-5" />
          </div>
          <span class="text-base sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 hidden sm:block">
            Dynamic Translator API
          </span>
          <span class="text-base sm:hidden font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Translator API
          </span>
        </div>
        
        {/* Desktop Menu */}
        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button onClick={() => onScrollTo('playground')} class="hover:text-indigo-400 transition">Playground</button>
          <button onClick={() => onScrollTo('register')} class="hover:text-indigo-400 transition">Get API Key</button>
          <button onClick={() => onScrollTo('pricing')} class="hover:text-indigo-400 transition">Pricing</button>
          <a href="/blog" class="hover:text-indigo-400 transition">Docs & Blog</a>
        </div>

        <div class="flex items-center gap-3">
          {hasKey ? (
            <a 
              href="/dashboard" 
              class="hidden md:flex px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 items-center gap-2"
            >
              <LayoutDashboard class="w-4 h-4" /> Go to Dashboard
            </a>
          ) : (
            <button 
              onClick={() => onScrollTo('register')} 
              class="hidden md:flex px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 items-center gap-2"
            >
              <Key class="w-4 h-4" /> Get Free Key
            </button>
          )}
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            class="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            {isOpen ? <X class="w-5 h-5" /> : <Menu class="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div class="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 shadow-xl p-4 flex flex-col gap-4">
          <button onClick={() => handleScroll('playground')} class="text-left font-medium text-slate-300 hover:text-indigo-400 p-2">Playground</button>
          <button onClick={() => handleScroll('register')} class="text-left font-medium text-slate-300 hover:text-indigo-400 p-2">Get API Key</button>
          <button onClick={() => handleScroll('pricing')} class="text-left font-medium text-slate-300 hover:text-indigo-400 p-2">Pricing</button>
          <a href="/blog" class="text-left font-medium text-slate-300 hover:text-indigo-400 p-2">Docs & Blog</a>
          <button 
            onClick={() => handleScroll('register')} 
            class="w-full py-3 mt-2 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <Key class="w-4 h-4" /> Get Free Key
          </button>
        </div>
      )}
    </nav>
  );
}
