import React, { useState } from 'react';
import { Key, Check, Copy, Loader2 } from 'lucide-react';

export default function KeyGenerator({ apiKey, onKeyGenerated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const bodyData = isLogin ? { email, password } : { name, email, password, plan: 'free' };

      const response = await fetch(`https://translater-free-api.onrender.com/api/v1/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const key = data.user.apiKey || data.user.existingApiKey;
        setGeneratedKey(key);
        onKeyGenerated(key);
        // Redirect directly to the dashboard
        window.location.href = '/dashboard';
      } else {
        alert(data.error || "Authentication failed.");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first to reset your password.");
      return;
    }
    try {
      const response = await fetch('https://translater-free-api.onrender.com/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      alert(data.message || "Reset link sent.");
    } catch (err) {
      alert("Error sending request.");
    }
  };

  return (
    <section id="register" class="scroll-mt-28">
      <div class="glass-card rounded-3xl p-5 sm:p-8 md:p-12 border border-indigo-500/20 relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
              Instant Access
            </span>

            <h2 class="text-3xl font-extrabold text-white mt-4 mb-4">
              Sign In to Your Dashboard
            </h2>

            <p class="text-slate-300 text-sm leading-relaxed mb-6">
              Create an account or login to access your API keys, analytics, and <strong>100 free words/month</strong>.
            </p>

            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Free 100 words quota</li>
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Full access to 100+ languages</li>
              <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Instant HTTP API Key</li>
            </ul>
          </div>

          {apiKey ? (
            <div class="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col justify-center items-center text-center space-y-4 h-full min-h-[300px]">
              <div class="w-16 h-16 bg-emerald-900/50 rounded-full flex items-center justify-center mb-2">
                <Check class="w-8 h-8 text-emerald-400" />
              </div>
              <h3 class="text-xl font-bold text-white">You are logged in!</h3>
              <p class="text-slate-400 text-sm">You already have an active session.</p>
              
              <button 
                onClick={() => window.location.href = '/dashboard'}
                class="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-bold text-white transition shadow-lg"
              >
                Go to Dashboard →
              </button>
            </div>
          ) : (
          <form onSubmit={handleAuth} class="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
            
            {!isLogin && (
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
            )}

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

            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-xs font-semibold text-slate-400">Password</label>
                {isLogin && (
                  <button type="button" onClick={handleForgotPassword} class="text-xs text-indigo-400 hover:text-indigo-300">
                    Forgot Password?
                  </button>
                )}
              </div>
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              class="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-bold text-white transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 class="w-4 h-4 animate-spin" /> : null}
              {loading ? "Authenticating..." : (isLogin ? "Sign In" : "Create Account")}
            </button>
            
            <div class="text-center text-xs text-slate-400 pt-2">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                class="text-indigo-400 hover:text-indigo-300 font-semibold transition"
              >
                {isLogin ? "Sign up here" : "Sign in here"}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}



