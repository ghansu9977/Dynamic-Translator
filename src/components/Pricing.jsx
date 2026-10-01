import React, { useState, useEffect } from 'react';
import { Check, Loader } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

export default function Pricing({ onScrollTo }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ plan: '', amount: 0 });
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('https://translater-free-api.onrender.com/api/v1/plans'); // Live URL as requested
        if (!res.ok) throw new Error('Failed to fetch plans');
        const data = await res.json();
        if (data.success) {
          setPlans(data.plans);
        } else {
          throw new Error('Error loading plans');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

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

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-900/50 max-w-lg mx-auto">
          {error}
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((p) => (
            <div 
              key={p.planId} 
              className={`glass-card rounded-2xl p-8 flex flex-col justify-between transition relative ${p.tag === 'Best Value' ? 'border-2 border-indigo-500 shadow-2xl glow-effect' : 'border border-slate-800 hover:border-slate-700'}`}
            >
              {p.tag && (
                <div class="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  {p.tag}
                </div>
              )}
              
              <div>
                <div class={`text-xs font-bold uppercase tracking-wider mb-2 ${p.tag === 'Best Value' ? 'text-indigo-400' : 'text-amber-400'}`}>
                  {p.name}
                </div>
                <div class="text-4xl font-extrabold text-white mb-4">₹{p.price} <span class="text-slate-500 text-sm font-normal">/ 30 Days</span></div>
                <p class="text-xs text-slate-400 mb-6">Word Quota: {p.wordQuota >= 999999999 ? 'Unlimited' : p.wordQuota.toLocaleString()}</p>
                
                <ul class="space-y-3 text-sm text-slate-300 mb-8">
                  {p.features.map((feature, i) => (
                    <li key={i} class="flex items-center gap-2">
                      <Check class="w-4 h-4 text-emerald-400" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handleUpgrade(p.planId, p.price)}
                className={`w-full py-3.5 rounded-xl text-center font-bold text-sm transition ${p.tag === 'Best Value' ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/40' : 'border border-slate-700 hover:bg-slate-800 text-slate-200'}`}
              >
                {p.tag === 'Best Value' ? 'Upgrade to Pro' : `Get ${p.name}`}
              </button>
            </div>
          ))}
        </div>
      )}

      <CheckoutModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        plan={selectedPlan.plan} 
        amount={selectedPlan.amount} 
      />
    </section>
  );
}
