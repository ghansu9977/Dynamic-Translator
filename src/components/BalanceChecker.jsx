import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function BalanceChecker({ apiKey, setApiKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!apiKey) {
      alert("Please enter an API Key.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://translater-free-api.onrender.com/api/v1/auth/me', {
        headers: { 'x-api-key': apiKey }
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStats(data.user);
      } else {
        alert(data.error || "Failed to fetch balance.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const usagePercent = stats ? Math.min(100, Math.round((stats.wordsUsed / stats.wordQuota) * 100)) : 0;

  return (
    <section class="max-w-3xl mx-auto glass-card rounded-2xl p-6 border border-slate-800 text-center space-y-4">
      <h3 class="text-xl font-bold text-white">📊 Check Your API Balance & Usage</h3>
      <p class="text-xs text-slate-400">Paste your API Key below to check your remaining words quota live from database.</p>

      <div class="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="Paste your API Key (e.g. dt_live_...)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          class="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
        />

        <button 
          onClick={handleCheck}
          disabled={loading}
          class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 class="w-4 h-4 animate-spin" /> : <Search class="w-4 h-4" />}
          Check Balance
        </button>
      </div>

      {stats && (
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-sm space-y-2">
          <div class="flex justify-between items-center flex-wrap gap-2 mb-2">
            <span class="text-slate-400">Plan: <strong class="text-indigo-400 uppercase">{stats.plan || 'FREE'}</strong></span>
            <span class="text-slate-400">Words Remaining: <strong class="text-emerald-400">{stats.wordsRemaining ?? (stats.wordQuota - stats.wordsUsed)} / {stats.wordQuota}</strong></span>
          </div>

          <div class="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div class="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${usagePercent}%` }}></div>
          </div>
        </div>
      )}
    </section>
  );
}
