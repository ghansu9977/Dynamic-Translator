import React, { useState, useEffect } from 'react';
import { Lock, Plus, Edit, Trash2, LogOut, Check } from 'lucide-react';

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState(localStorage.getItem('dt_admin_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('dt_admin_key'));
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, freeUsers: 0, paidUsers: 0 });
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterPlan, setFilterPlan] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'plans' | 'blogs'
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState({ title: '', slug: '', excerpt: '', content: '', imageUrl: '' });

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({
    planId: '', name: '', price: 0, wordQuota: 500, features: '', tag: '', isActive: true
  });

  const BASE_URL = 'https://translater-free-api.onrender.com';

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const [plansRes, statsRes, usersRes] = await Promise.all([
        fetch(`${BASE_URL}/api/v1/admin/plans`, { headers: { 'x-admin-key': adminKey } }),
        fetch(`${BASE_URL}/api/v1/admin/stats`, { headers: { 'x-admin-key': adminKey } }),
        fetch(`${BASE_URL}/api/v1/admin/users?page=${page}&limit=10&plan=${filterPlan}`, { headers: { 'x-admin-key': adminKey } })
      ]);

      const plansData = await plansRes.json();
      
      if (plansRes.ok) {
        setPlans(plansData.plans);
        setIsAuthenticated(true);
        localStorage.setItem('dt_admin_key', adminKey);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }
        
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users);
          setTotalPages(usersData.pagination.totalPages);
        }
      } else {
        throw new Error(plansData.error || 'Invalid Admin Key');
      }
      
      // Fetch Blogs
      try {
        const blogsRes = await fetch(`${BASE_URL}/api/v1/blogs`);
        if (blogsRes.ok) {
           const blogsData = await blogsRes.json();
           setBlogs(blogsData.data || []);
        }
      } catch(e) { console.error('Failed to fetch blogs', e); }

    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
      localStorage.removeItem('dt_admin_key');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlans();
    }
  }, [isAuthenticated, page, filterPlan]);

  const handleLogin = (e) => {
    e.preventDefault();
    fetchPlans();
  };

  const handleLogout = () => {
    localStorage.removeItem('dt_admin_key');
    setIsAuthenticated(false);
    setAdminKey('');
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...currentPlan,
        features: currentPlan.features.split(',').map(f => f.trim())
      };

      const url = isEditing && currentPlan._id 
        ? `${BASE_URL}/api/v1/admin/plans/${currentPlan._id}` 
        : `${BASE_URL}/api/v1/admin/plans`;
        
      const method = isEditing && currentPlan._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': adminKey 
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save plan');
      
      fetchPlans();
      setCurrentPlan({ planId: '', name: '', price: 0, wordQuota: 500, features: '', tag: '', isActive: true });
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/v1/admin/plans/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      if (res.ok) fetchPlans();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Just a simple create blog flow (no auth needed for now since the backend route is open in this example, but normally would have auth)
      const res = await fetch(`${BASE_URL}/api/v1/blogs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentBlog)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save blog');
      
      fetchPlans(); // re-fetch to get updated blogs
      setCurrentBlog({ title: '', slug: '', excerpt: '', content: '', imageUrl: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setCurrentPlan({
      ...plan,
      features: plan.features.join(', ')
    });
    setIsEditing(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-500 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h2>
          {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}
          <input 
            type="password" 
            placeholder="Enter Admin Secret Key" 
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 mb-4"
          />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition">
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Control Panel</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-semibold transition">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-slate-800 mb-8 pb-px">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Users & Stats
          </button>
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition ${activeTab === 'plans' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Manage Plans
          </button>
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition ${activeTab === 'blogs' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Manage Blogs
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Total Users</p>
                  <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
                </div>
                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold text-xl">👥</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Free Tier</p>
                  <h3 className="text-3xl font-bold text-slate-300">{stats.freeUsers}</h3>
                </div>
                <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center font-bold text-xl">🆓</div>
              </div>
              <div className="bg-slate-900 border border-emerald-900/50 p-6 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-900/20">
                <div>
                  <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-1">Paid Subscribers</p>
                  <h3 className="text-3xl font-bold text-emerald-400">{stats.paidUsers}</h3>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold text-xl">💎</div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Registered Users Directory
                </h3>
                
                <div className="flex items-center gap-4">
                  {/* Filter Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-slate-400">Filter by Plan:</label>
                    <select 
                      value={filterPlan} 
                      onChange={(e) => {
                        setFilterPlan(e.target.value);
                        setPage(1); // Reset to page 1 on filter change
                      }}
                      className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">All Plans</option>
                      <option value="free">Free</option>
                      {plans.map(p => (
                        <option key={p.planId} value={p.planId}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-1.5 bg-slate-800 text-slate-300 font-semibold text-sm rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium text-slate-400">Page <span className="text-white">{page}</span> of {totalPages}</span>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-1.5 bg-slate-800 text-slate-300 font-semibold text-sm rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-4">User Name</th>
                      <th className="px-6 py-4">Email Address</th>
                      <th className="px-6 py-4">Active Plan</th>
                      <th className="px-6 py-4">API Key</th>
                      <th className="px-6 py-4">Usage (Words)</th>
                      <th className="px-6 py-4">Join Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-800/40 transition group">
                        <td className="px-6 py-4 font-bold text-white group-hover:text-indigo-400 transition">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${u.plan === 'free' ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                            {u.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500 bg-slate-950/30 rounded p-1 mx-4 my-2 inline-block border border-slate-800">{u.apiKey}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-300">{u.wordsUsed}</span> 
                            <span className="text-slate-600">/</span> 
                            <span className="text-slate-500">{u.wordQuota >= 999999999 ? '∞' : u.wordQuota}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-lg">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Plan Form */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6">{isEditing ? 'Edit Plan Details' : 'Create New Plan'}</h3>
                <form onSubmit={handleSavePlan} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Plan ID (Unique)</label>
                    <input type="text" value={currentPlan.planId} onChange={e => setCurrentPlan({...currentPlan, planId: e.target.value})} required disabled={isEditing} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" placeholder="e.g. enterprise" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Display Name</label>
                    <input type="text" value={currentPlan.name} onChange={e => setCurrentPlan({...currentPlan, name: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" placeholder="e.g. Enterprise Edition" />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Price (₹)</label>
                      <input type="number" value={currentPlan.price} onChange={e => setCurrentPlan({...currentPlan, price: Number(e.target.value)})} required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Word Quota</label>
                      <input type="number" value={currentPlan.wordQuota} onChange={e => setCurrentPlan({...currentPlan, wordQuota: Number(e.target.value)})} required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Badge Tag (Optional)</label>
                    <input type="text" value={currentPlan.tag} onChange={e => setCurrentPlan({...currentPlan, tag: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" placeholder="e.g. Best Value" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Features (Comma Separated)</label>
                    <textarea value={currentPlan.features} onChange={e => setCurrentPlan({...currentPlan, features: e.target.value})} rows="3" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition leading-relaxed" placeholder="Feature 1, Feature 2, Feature 3"></textarea>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-slate-800">
                    <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition shadow-lg shadow-indigo-600/20">
                      <Check className="w-4 h-4" /> {isEditing ? 'Update Plan' : 'Save Plan'}
                    </button>
                    {isEditing && (
                       <button type="button" onClick={() => { setIsEditing(false); setCurrentPlan({ planId: '', name: '', price: 0, wordQuota: 500, features: '', tag: '', isActive: true }) }} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 rounded-xl transition">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Plans List */}
            <div className="lg:col-span-2 space-y-4">
              {loading && plans.length === 0 ? (
                <div className="flex justify-center py-12">
                  <p className="text-slate-400 font-semibold animate-pulse">Loading plans data...</p>
                </div>
              ) : (
                plans.map(plan => (
                  <div key={plan._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-lg hover:border-slate-700 transition group">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition">{plan.name} <span className="text-sm font-normal text-slate-500">({plan.planId})</span></h4>
                        {plan.tag && <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md">{plan.tag}</span>}
                      </div>
                      <div className="text-sm text-slate-400 flex items-center gap-4">
                        <span>Price: <b className="text-emerald-400 font-mono text-base">₹{plan.price}</b></span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span>Quota: <b className="text-white font-mono">{plan.wordQuota >= 999999999 ? 'Unlimited' : plan.wordQuota}</b> words</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(plan)} className="p-3 bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 rounded-xl transition shadow-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(plan._id)} className="p-3 bg-slate-950 border border-slate-800 hover:border-red-500 hover:text-red-400 text-slate-400 rounded-xl transition shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Blog Form */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6">Create New Blog</h3>
                <form onSubmit={handleSaveBlog} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Title</label>
                    <input type="text" value={currentBlog.title} onChange={e => setCurrentBlog({...currentBlog, title: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" placeholder="Enter title" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Slug</label>
                    <input type="text" value={currentBlog.slug} onChange={e => setCurrentBlog({...currentBlog, slug: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" placeholder="e.g. how-to-translate-app" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Image URL (Optional)</label>
                    <input type="text" value={currentBlog.imageUrl} onChange={e => setCurrentBlog({...currentBlog, imageUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" placeholder="https://example.com/image.jpg" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Excerpt (Short Summary)</label>
                    <textarea value={currentBlog.excerpt} onChange={e => setCurrentBlog({...currentBlog, excerpt: e.target.value})} rows="2" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition leading-relaxed" placeholder="Short description for SEO"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Content (HTML allowed)</label>
                    <textarea value={currentBlog.content} onChange={e => setCurrentBlog({...currentBlog, content: e.target.value})} rows="6" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition leading-relaxed" placeholder="Full blog content..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition shadow-lg shadow-indigo-600/20">
                    <Plus className="w-4 h-4" /> Publish Blog
                  </button>
                </form>
              </div>
            </div>

            {/* Blogs List */}
            <div className="lg:col-span-2 space-y-4">
              {blogs.length === 0 ? (
                <div className="flex justify-center py-12">
                  <p className="text-slate-400 font-semibold">No blogs found. Create one!</p>
                </div>
              ) : (
                blogs.map(blog => (
                  <div key={blog._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg hover:border-slate-700 transition flex gap-4">
                    {blog.imageUrl && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover rounded-xl border border-slate-800" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{blog.title}</h4>
                      <p className="text-sm text-indigo-400 mb-2">{blog.slug}</p>
                      <p className="text-slate-400 text-sm mb-2 line-clamp-2">{blog.excerpt}</p>
                      <p className="text-xs text-slate-500">Published on {new Date(blog.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
