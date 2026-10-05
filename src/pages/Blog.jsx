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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map(blog => (
                <article key={blog._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-xl flex flex-col">
                  {blog.imageUrl && (
                    <a href={`/blog/${blog.slug}`} className="block w-full h-48 overflow-hidden">
                      <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </a>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center text-indigo-400 mb-3 text-xs font-semibold tracking-wide uppercase">
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="bg-indigo-500/10 px-2 py-1 rounded">{blog.readTime || '5 min read'}</span>
                    </div>
                    
                    <a href={`/blog/${blog.slug}`} className="block group">
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                    </a>
                    
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {blog.excerpt || 'Read this amazing article on our blog to learn more about dynamic localization and APIs...'}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-800/50">
                      <a 
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group"
                      >
                        Read Full Article 
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-10">More articles coming soon!</div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
