import React from 'react';

export default function Footer() {
  return (
    <footer class="border-t border-slate-900 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo" class="w-6 h-6 rounded-md object-cover opacity-80 hover:opacity-100 transition-opacity" />
          <span>© 2026 Dynamic Translator API. All rights reserved.</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
}
