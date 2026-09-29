import React, { useState } from 'react';
import { Key, Check, Copy, Loader2 } from 'lucide-react';

export default function KeyGenerator({ onKeyGenerated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please enter both name and email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, plan: 'free' })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const key = data.user.apiKey || data.user.existingApiKey;
        setGeneratedKey(key);
        onKeyGenerated(key);
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="register" class="scroll-mt-28">
      <div class="glass-card rounded-3xl p-8 md:p-12 border border-indigo-500/20 relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
              Instant Access
            </span>

            <h2 class="text-3xl font-extrabold text-white mt-4 mb-4">
              Get Your Free API Key in 5 Seconds
            </h2>

            <p class="text-slate-300 text-sm leading-relaxed mb-6">
              Start integrating immediately with <strong>5,000 free words/month</strong>. No credit card required. Instant activation.
            </p>

            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Free 5,000 words quota</li>
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Full access to 100+ languages</li>
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Instant HTTP API Key</li>
            </ul>
          </div>

          <form onSubmit={handleRegister} class="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Your Name</label>
              <input 
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <input 
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              class="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-bold text-white transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 class="w-4 h-4 animate-spin" /> : <Key class="w-4 h-4" />}
              {loading ? "Generating Key..." : "Generate Free Key"}
            </button>

            {generatedKey && (
              <div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-2">
                <div class="text-xs font-bold text-emerald-400 flex justify-between items-center">
                  <span>🎉 Your API Key Created!</span>
                  <span class="bg-emerald-900 text-emerald-200 text-[10px] px-2 py-0.5 rounded">5,000 Words</span>
                </div>

                <div class="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <input 
                    type="text" 
                    readOnly 
                    value={generatedKey}
                    class="bg-transparent font-mono text-xs text-indigo-300 w-full focus:outline-none"
                  />
                  <button 
                    type="button"
                    onClick={copyKey}
                    class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded font-semibold transition flex items-center gap-1"
                  >
                    {copied ? <Check class="w-3 h-3" /> : <Copy class="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
