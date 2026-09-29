import React, { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';

export default function Playground({ apiKey, setApiKey }) {
  const [inputText, setInputText] = useState("Hello world!\nWelcome to our dynamic application.\nHow can I help you today?");
  const [targetLang, setTargetLang] = useState("hi");
  const [output, setOutput] = useState({ status: "ready", note: "Click 'Translate Now' to test API..." });
  const [loading, setLoading] = useState(false);
  const [badge, setBadge] = useState({ text: "Ready", type: "neutral" });
  const [speed, setSpeed] = useState("~250ms");
  const [engine, setEngine] = useState("google-translate-x");

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    const textsArray = inputText.split('\n').map(t => t.trim()).filter(t => t.length > 0);

    setLoading(true);
    setBadge({ text: "Translating...", type: "warning" });

    const startTime = Date.now();

    try {
      const response = await fetch('/api/v1/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || 'dt_live_demo12345'
        },
        body: JSON.stringify({
          texts: textsArray,
          targetLanguage: targetLang
        })
      });

      const data = await response.json();
      setSpeed(`${Date.now() - startTime}ms`);
      setOutput(data);

      if (response.ok && data.success) {
        setBadge({ text: "200 OK", type: "success" });
        if (data.engine) setEngine(data.engine);
      } else {
        setBadge({ text: `${response.status} Error`, type: "error" });
      }
    } catch (err) {
      setOutput({ error: err.message });
      setBadge({ text: "Network Error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="playground" class="scroll-mt-28">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-3">⚡ Live API Playground</h2>
        <p class="text-slate-400">Test the translation API in real-time right here in your browser.</p>
      </div>

      <div class="glass-card rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Area */}
          <div class="space-y-4">
            <div class="flex flex-wrap gap-2 justify-between items-center">
              <label class="text-sm font-semibold text-slate-300">Input Texts (Array or Paragraph):</label>
              <span class="text-xs text-slate-500">Separated by line breaks</span>
            </div>

            <textarea 
              rows="5" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              class="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm font-sans"
            />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Target Language:</label>
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="gu">Gujarati (ગુજરાતી)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="ja">Japanese (日本語)</option>
                  <option value="ru">Russian (Русский)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">API Key:</label>
                <input 
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <button 
              onClick={handleTranslate}
              disabled={loading}
              class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {loading ? <Loader2 class="w-4 h-4 animate-spin" /> : <Zap class="w-4 h-4 fill-white" />}
              {loading ? "Translating..." : "Translate Now"}
            </button>
          </div>

          {/* Output Area */}
          <div class="space-y-4 flex flex-col justify-between">
            <div>
              <div class="flex flex-wrap gap-2 justify-between items-center mb-2">
                <label class="text-sm font-semibold text-slate-300">API Response Output:</label>
                <span class={`text-xs px-2.5 py-1 rounded-full font-mono ${
                  badge.type === 'success' ? 'bg-emerald-900/60 text-emerald-300' :
                  badge.type === 'error' ? 'bg-rose-900/60 text-rose-300' :
                  badge.type === 'warning' ? 'bg-amber-900/60 text-amber-300' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {badge.text}
                </span>
              </div>
              
              <pre class="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto min-h-[200px] max-h-[300px]">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>

            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span>Engine Used: <strong class="text-indigo-400">{engine}</strong></span>
              <span>Response Time: <strong class="text-slate-200">{speed}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
