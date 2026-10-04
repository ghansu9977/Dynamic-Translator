import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://translater-free-api.onrender.com/api/v1/blogs')
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setBlogs(data.data);
        }
      })
      .catch(err => console.error('Error fetching blogs:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full">
      <Navbar onScrollTo={(id) => {
        if(id) {
            window.location.href = `/#${id}`;
        } else {
            window.location.href = '/';
        }
      }} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 flex-grow w-full mt-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">
          Documentation & Blog
        </h1>
        <p className="text-slate-400 mb-12 text-lg">Learn how to localize your apps dynamically and improve your international reach.</p>
        
        
        {loading ? (
          <div className="text-center text-slate-400 py-10 animate-pulse">Loading amazing articles...</div>
        ) : (
          blogs.length > 0 ? (
            blogs.map(blog => (
              <article key={blog._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-8 hover:border-indigo-500/50 transition-all duration-300 shadow-xl">
                {blog.imageUrl && (
                  <div className="w-full h-64 md:h-80 overflow-hidden">
                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{blog.title}</h2>
                  <p className="text-indigo-400 mb-6 text-sm font-semibold tracking-wide uppercase">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {blog.readTime || '5 min read'}
                  </p>
                  <div 
                    className="text-slate-300 leading-relaxed mb-6 text-lg prose prose-invert max-w-none prose-a:text-indigo-400 hover:prose-a:text-indigo-300"
                    dangerouslySetInnerHTML={{ __html: blog.content }} 
                  />
                </div>
              </article>
            ))
          ) : (
            <div className="text-center text-slate-400 py-10">More articles coming soon!</div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
