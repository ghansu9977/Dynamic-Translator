import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Key, Settings, Copy, RefreshCw, Trash2, 
  Search, Bell, Activity, CheckCircle2, XCircle, Loader2, User as UserIcon, BookOpen, Menu, X
} from 'lucide-react';

export default function UserDashboard() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("dt_user_api_key") || "");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile responsiveness
  
  // Dynamic Data States
  const [userData, setUserData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiKey) {
      setError("No API Key found. Please generate a key first.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const [userRes, analyticsRes] = await Promise.all([
          fetch('https://translater-free-api.onrender.com/api/v1/auth/me', { headers: { 'x-api-key': apiKey } }),
          fetch('https://translater-free-api.onrender.com/api/v1/auth/analytics', { headers: { 'x-api-key': apiKey } }).catch(() => null)
        ]);
        
        const data = await userRes.json();
        const analyticsJson = analyticsRes ? await analyticsRes.json().catch(() => null) : null;
        
        if (data.success) {
          setUserData(data.user);
          if (analyticsJson && analyticsJson.success) {
            setAnalyticsData(analyticsJson.analytics);
          }
        } else {
          setError(data.error || "Failed to load user data");
        }
      } catch (err) {
        console.error(err);
        setUserData({
          name: "Developer",
          email: "dev@example.com",
          plan: "free",
          wordQuota: 5000,
          wordsUsed: 1400,
          createdAt: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiKey]);

  const copyToClipboard = () => {
    if(!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#020617] items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="flex h-screen bg-[#020617] items-center justify-center flex-col gap-4 text-white p-4 text-center">
        <XCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-xl font-bold">{error}</h2>
        <a href="/" className="text-indigo-400 underline">Go back to Home</a>
      </div>
    );
  }

  // Calculate dynamic percentages
  const wordsUsed = userData?.wordsUsed || 0;
  const wordQuota = userData?.wordQuota || 100;
  const wordsRemaining = Math.max(0, wordQuota - wordsUsed);
  const usagePercentage = wordQuota > 0 ? Math.min(100, Math.round((wordsUsed / wordQuota) * 100)) : 0;
  
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (usagePercentage / 100) * circumference;

  const initials = userData?.name ? userData.name.substring(0, 2).toUpperCase() : "DV";
  const planName = userData?.plan ? userData.plan.toUpperCase() : "FREE PLAN";

  const renderSidebarItem = (id, icon, label) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={() => handleTabClick(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
          isActive 
            ? 'bg-white/10 text-white border border-white/10 shadow-inner' 
            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
        }`}
      >
        {React.cloneElement(icon, { className: `w-5 h-5 ${isActive ? 'text-indigo-400' : ''}` })}
        {label}
      </button>
    );
  };

  // ---------------------------------------------------------
  // TAB CONTENTS
  // ---------------------------------------------------------

  const renderDashboardTab = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0a0f1e] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-white font-semibold text-lg sm:text-xl">Real-time API Requests</h3>
              <p className="text-slate-500 text-sm">Live translations metric</p>
            </div>
            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-bold text-white">{wordsUsed}</p>
              <p className="text-slate-500 text-sm">Words Translated</p>
            </div>
          </div>

          <div className="h-32 sm:h-48 w-full mt-4 relative z-10 flex items-end">
            <svg viewBox="0 0 500 150" className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                  <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                </linearGradient>
              </defs>
              <path d="M0,100 C50,80 100,120 150,60 C200,0 250,90 300,50 C350,10 400,110 450,70 C480,50 500,80 500,80 L500,150 L0,150 Z" fill="url(#gradient)" />
              <path d="M0,100 C50,80 100,120 150,60 C200,0 250,90 300,50 C350,10 400,110 450,70 C480,50 500,80 500,80" fill="none" stroke="#a855f7" strokeWidth="3" />
              <circle cx="200" cy="18" r="5" fill="#fff" className="animate-pulse shadow-[0_0_20px_#a855f7]" />
            </svg>
          </div>
        </div>

        <div className="bg-[#0a0f1e] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Usage & Quota</h3>
            <p className="text-slate-500 text-sm">Words Used ({usagePercentage}%)</p>
          </div>
          
          <div className="flex items-center justify-center my-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="42%" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                <circle cx="50%" cy="50%" r="42%" stroke={usagePercentage > 90 ? "#ef4444" : "#10b981"} strokeWidth="12" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className={`drop-shadow-[0_0_10px_${usagePercentage > 90 ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.5)'}] transition-all duration-1000 ease-out`} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-bold text-white">{usagePercentage}%</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-xl">{wordsUsed.toLocaleString()} <span className="text-slate-500 text-sm font-normal">/ {wordQuota.toLocaleString()}</span></p>
            <p className={`${usagePercentage > 90 ? 'text-rose-400' : 'text-emerald-400'} text-xs font-semibold uppercase tracking-wider mb-2`}>{usagePercentage > 90 ? 'Quota Limit Approaching' : 'Current Plan Quota'}</p>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className={`${usagePercentage > 90 ? 'bg-rose-500 shadow-[0_0_10px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'} h-full transition-all duration-1000`} style={{ width: `${usagePercentage}%` }}></div>
            </div>
            <p className="text-slate-500 text-xs mt-3">{wordsRemaining.toLocaleString()} words remaining</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#0a0f1e] border border-white/5 rounded-2xl p-6 shadow-xl overflow-hidden">
          <h3 className="text-white font-semibold text-lg mb-6">Quick API Key Copy</h3>
          <div className="bg-[#020617] border border-white/10 rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 text-slate-300 font-mono text-xs sm:text-sm overflow-hidden w-full">
              <Key className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate w-full block">{apiKey}</span>
            </div>
            <button onClick={copyToClipboard} className="flex shrink-0 w-full sm:w-auto items-center justify-center gap-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white px-3 py-2 sm:py-1.5 rounded-lg text-sm font-semibold transition-all border border-indigo-500/30">
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <button onClick={() => handleTabClick('keys')} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Manage all keys →</button>
        </div>

        <div className="bg-[#0a0f1e] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-white font-semibold text-lg mb-6">Recent Translations</h3>
          <div className="flex-1 space-y-4">
            {[
              { path: "Translated 120 words to 'es'", method: "API", status: "SUCCESS", color: "emerald" },
              { path: "Translated 45 words to 'hi'", method: "API", status: "SUCCESS", color: "emerald" },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-indigo-400`}>{log.method}</span>
                  <span className="text-slate-300 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-xs">{log.path}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono shrink-0">
                  <span className={`text-${log.color}-400`}>{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderAnalyticsTab = () => {
    // Dynamic values or fallbacks if backend is not deployed yet
    const totalRequests = analyticsData?.totalRequests || 0;
    
    // Assign colors dynamically for languages
    const colors = ["bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-rose-500", "bg-emerald-500"];
    const topLanguages = (analyticsData?.topLanguages && analyticsData.topLanguages.length > 0) 
      ? analyticsData.topLanguages.map((item, idx) => ({ ...item, color: colors[idx % colors.length] }))
      : [{ lang: "No Data Yet", percent: 0, color: "bg-slate-600" }];

    // Prepare 7 days chart data
    let dailyData = [0, 0, 0, 0, 0, 0, 0];
    if (analyticsData?.requestsByDate && analyticsData.requestsByDate.length > 0) {
      // Very basic mapping for the UI (just taking the last 7 values if available)
      const recent = analyticsData.requestsByDate.slice(-7);
      dailyData = dailyData.map((_, i) => recent[i] ? recent[i].count : 0);
    }
    const maxVal = Math.max(...dailyData, 10); // Prevent division by zero

    return (
      <div className="bg-[#0a0f1e] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Detailed Analytics</h2>
        <p className="text-slate-400 mb-8 text-sm sm:text-base">Metrics and language breakdown for your API usage.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#020617] border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl"></div>
            <h4 className="text-slate-400 text-sm font-medium mb-1">Total API Calls</h4>
            <p className="text-2xl font-bold text-white">{totalRequests.toLocaleString()}</p>
            <p className="text-emerald-400 text-xs mt-2 font-medium">Logged in Database</p>
          </div>
          <div className="bg-[#020617] border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <h4 className="text-slate-400 text-sm font-medium mb-1">Words Translated</h4>
            <p className="text-2xl font-bold text-white">{wordsUsed.toLocaleString()}</p>
            <p className="text-emerald-400 text-xs mt-2 font-medium">Across all requests</p>
          </div>
          <div className="bg-[#020617] border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
            <h4 className="text-slate-400 text-sm font-medium mb-1">Active Status</h4>
            <p className="text-2xl font-bold text-emerald-400">Online</p>
            <p className="text-slate-500 text-xs mt-2 font-medium">System operational</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Languages */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Top Target Languages
            </h3>
            <div className="space-y-4 bg-[#020617] p-5 rounded-xl border border-white/5 min-h-[240px]">
              {topLanguages.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{item.lang}</span>
                    <span className="text-slate-400">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requests Over Time */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Requests Over Time (Last 7 Days)
            </h3>
            <div className="h-[240px] bg-[#020617] p-5 rounded-xl border border-white/5 flex items-end justify-between gap-2 sm:gap-4 pt-10">
              {dailyData.map((val, idx) => {
                const height = maxVal > 0 ? (val / maxVal) * 100 : 0;
                return (
                  <div key={idx} className="w-full flex flex-col items-center gap-2 group">
                    <div className="w-full bg-indigo-500/20 rounded-t-sm relative hover:bg-indigo-500/40 transition-colors" style={{ height: `${height}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-500">D{idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderKeysTab = () => (
    <div className="bg-[#0a0f1e] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-white">API Keys</h2>
        <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/30">
          + Create New Key
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-[#020617] border border-white/10 rounded-xl p-4 sm:p-6 overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Production Key</h3>
              <p className="text-xs sm:text-sm text-slate-500">Created: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Recently"}</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border border-emerald-500/30">ACTIVE</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 mb-6 gap-3">
            <code className="text-slate-300 text-xs sm:text-sm font-mono break-all sm:break-normal">{apiKey}</code>
            <button onClick={copyToClipboard} className="text-indigo-400 hover:text-white transition p-2 bg-white/5 sm:bg-transparent rounded w-full sm:w-auto flex justify-center">
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition">
              <RefreshCw className="w-4 h-4" /> Rotate Key
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/30 px-4 py-2 rounded-lg transition">
              <Trash2 className="w-4 h-4" /> Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocsTab = () => (
    <div className="bg-[#0a0f1e] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">API Documentation</h2>
      <p className="text-slate-400 mb-8 text-sm sm:text-base">Use your API key to send requests. Below are quick examples of how to implement them.</p>
      
      <div className="space-y-8">
        {/* Translate API */}
        <div>
          <h3 className="text-indigo-400 font-bold mb-2">1. Translate Texts</h3>
          <p className="text-slate-500 text-sm mb-3">Translate an array of texts into your target language.</p>
          <code className="bg-[#020617] text-emerald-400 px-4 py-3 rounded-xl block border border-white/10 font-mono text-sm overflow-x-auto mb-3">
            POST https://translater-free-api.onrender.com/api/v1/translate
          </code>
          <pre className="bg-[#020617] text-slate-300 p-4 rounded-xl border border-white/10 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
{`const response = await fetch("https://translater-free-api.onrender.com/api/v1/translate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${apiKey}"
  },
  body: JSON.stringify({
    texts: ["Hello, welcome to my app!"],
    targetLanguage: "hi" // Hindi
  })
});

const data = await response.json();
console.log(data.translations);`}
          </pre>
        </div>

        <div className="w-full h-px bg-white/5"></div>

        {/* Check Credits API */}
        <div>
          <h3 className="text-indigo-400 font-bold mb-2">2. Check Credits & Quota</h3>
          <p className="text-slate-500 text-sm mb-3">Get real-time details about your remaining words and account limits.</p>
          <code className="bg-[#020617] text-blue-400 px-4 py-3 rounded-xl block border border-white/10 font-mono text-sm overflow-x-auto mb-3">
            GET https://translater-free-api.onrender.com/api/v1/auth/me
          </code>
          <pre className="bg-[#020617] text-slate-300 p-4 rounded-xl border border-white/10 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
{`const response = await fetch("https://translater-free-api.onrender.com/api/v1/auth/me", {
  method: "GET",
  headers: {
    "x-api-key": "${apiKey}"
  }
});

const data = await response.json();
console.log("Words Remaining:", data.user.wordsRemaining);`}
          </pre>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="bg-[#0a0f1e] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-8">Profile & Settings</h2>
      
      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-[0_0_20px_rgba(99,102,241,0.4)] shrink-0">
          {initials}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-2xl font-bold text-white mb-1">{userData?.name || "Developer"}</h3>
          <p className="text-slate-400 mb-3">{userData?.email || "No email provided"}</p>
          <span className="bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {planName} USER
          </span>
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6 max-w-lg">
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Full Name</label>
          <input type="text" defaultValue={userData?.name || ""} className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Email Address</label>
          <input type="email" readOnly defaultValue={userData?.email || ""} className="w-full bg-[#020617] border border-white/5 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed" />
        </div>
        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-600/30 mt-4">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#0a0f1e] border-r border-white/5 p-4 flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-10 mt-2 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              D
            </div>
            <span className="font-bold text-white text-lg tracking-wide">API Insights</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {renderSidebarItem('dashboard', <BarChart3 />, 'Dashboard')}
          {renderSidebarItem('analytics', <Activity />, 'Analytics')}
          {renderSidebarItem('keys', <Key />, 'API Keys')}
          {renderSidebarItem('docs', <BookOpen />, 'API Docs')}
          {renderSidebarItem('settings', <Settings />, 'Profile & Settings')}
        </nav>
        
        <div className="mt-auto p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl cursor-pointer hover:bg-white/5 transition">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
               <UserIcon className="w-4 h-4 text-slate-300" />
            </div>
            <div className="overflow-hidden">
               <p className="text-sm font-semibold text-white truncate">{userData?.name || "Dev"}</p>
               <p className="text-xs text-indigo-400 font-bold uppercase truncate">{planName}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 shrink-0 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 ml-4 shrink-0">
            <button className="relative hidden sm:block">
              <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-[#020617]"></span>
            </button>
            <div className="flex items-center gap-3 sm:border-l sm:border-white/10 sm:pl-6 cursor-pointer" onClick={() => handleTabClick('settings')}>
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(79,70,229,0.5)] shrink-0">
                {initials}
              </div>
              <span className="text-sm font-medium text-slate-300 hidden sm:block truncate max-w-[100px]">{userData?.name || "Developer"}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight capitalize">
              {activeTab === 'dashboard' ? 'API Analytics Dashboard' : activeTab.replace('-', ' ')}
            </h1>
            <a href="/" className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 font-medium">← Back to Home</a>
          </div>

          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'keys' && renderKeysTab()}
          {activeTab === 'docs' && renderDocsTab()}
          {activeTab === 'settings' && renderSettingsTab()}

        </div>
      </main>
    </div>
  );
}
