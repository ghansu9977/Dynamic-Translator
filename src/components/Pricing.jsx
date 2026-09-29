import React, { useState } from 'react';
import { Check } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

export default function Pricing({ onScrollTo }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ plan: '', amount: 0 });

  const handleUpgrade = (plan, amount) => {
    setSelectedPlan({ plan, amount });
    setModalOpen(true);
  };

  return (
    <section id="pricing" class="scroll-mt-28">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-white mb-3">Simple & Transparent Pricing</h2>
        <p class="text-slate-400">No hidden fees. Scale up as your application grows.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div class="glass-card rounded-2xl p-8 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
          <div>
            <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Free Tier</div>
            <div class="text-4xl font-extrabold text-white mb-4">₹0 <span class="text-slate-500 text-sm font-normal">/ life</span></div>
            <p class="text-xs text-slate-400 mb-6">Perfect for testing, hobby projects, and small mobile apps.</p>
            
            <ul class="space-y-3 text-sm text-slate-300 mb-8">
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> 5,000 Words Limit</li>
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> 100+ Languages</li>
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> 60 Req/min Rate Limit</li>
            </ul>
          </div>

          <button 
            onClick={() => onScrollTo('register')}
            class="w-full py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-center font-bold text-sm text-slate-200 transition"
          >
            Get Started Free
          </button>
        </div>

        {/* Pro Tier (Popular) */}
        <div class="glass-card rounded-2xl p-8 border-2 border-indigo-500 relative flex flex-col justify-between shadow-2xl glow-effect">
          <div class="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
            Best Value
          </div>
          <div>
            <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Pro Developer</div>
            <div class="text-4xl font-extrabold text-white mb-4">₹10 <span class="text-slate-500 text-sm font-normal">/ life</span></div>
            <p class="text-xs text-slate-400 mb-6">Ideal for production apps with multi-language support.</p>
            
            <ul class="space-y-3 text-sm text-slate-300 mb-8">
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> 100,000 Words Limit</li>
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Priority Support</li>
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> High Speed Translation</li>
            </ul>
          </div>

          <button 
            onClick={() => handleUpgrade('pro', 10)}
            class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-center font-bold text-sm text-white shadow-lg shadow-indigo-600/40 transition"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      <CheckoutModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        plan={selectedPlan.plan} 
        amount={selectedPlan.amount} 
      />
    </section>
  );
}
