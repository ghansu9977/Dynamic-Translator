import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];

    if (slug) {
      fetch(`https://translater-free-api.onrender.com/api/v1/blogs/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBlog(data.data);
            
            // Dynamic SEO
            document.title = `${data.data.title} | Dynamic Translator API`;
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute('content', data.data.excerpt);
            }

            // Inject JSON-LD Schema Markup for Articles
            const schema = {
              "@context": "https://schema.org",
              "@type": "TechArticle",
              "headline": data.data.title,
              "image": data.data.imageUrl || "https://dynamic-translatx.vercel.app/logo.jpg",
              "author": {
                "@type": "Organization",
                "name": data.data.author || "Dynamic Translator Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Dynamic Translator API",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://dynamic-translatx.vercel.app/logo.jpg"
                }
              },
              "datePublished": data.data.createdAt,
              "description": data.data.excerpt
            };

            const script = document.createElement('script');
            script.type = "application/ld+json";
            script.innerHTML = JSON.stringify(schema);
            document.head.appendChild(script);
          }
        })
        .catch(err => console.error('Error fetching blog details:', err))
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse">Loading professional article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <h2 className="text-3xl font-bold text-white mb-2">404 - Article Not Found</h2>
        <p className="mb-6">We couldn't find the article you were looking for.</p>
        <a href="/blog" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Go Back to Blog</a>
      </div>
    );
  }

  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full font-sans">
      <Navbar onScrollTo={(id) => { window.location.href = id ? `/#${id}` : '/'; }} />
      
      {/* Premium Hero Header for Blog */}
      <header className="relative pt-32 pb-20 overflow-hidden mt-10">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                {blog.tags[0]}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {blog.title}
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 p-[2px]">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {blog.author ? blog.author.charAt(0) : 'D'}
                </div>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-base">{blog.author || 'Dynamic Translator Team'}</p>
                <p className="text-xs text-slate-500 mt-0.5">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {blog.readTime || '5 min read'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 w-full relative z-10 flex flex-col md:flex-row gap-12">
        
        {/* Left Side: Social Share Sticky */}
        <aside className="hidden md:flex flex-col gap-4 sticky top-32 h-fit">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-2" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>
            Share Article
          </p>
          <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${blog.title}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1DA1F2] transition-all hover:-translate-y-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
          </a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${blog.title}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0077b5] transition-all hover:-translate-y-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
        </aside>

        {/* Article Body */}
        <article className="flex-grow min-w-0">
          {blog.imageUrl && (
            <div className="w-full h-auto mb-12 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-800">
              <img src={blog.imageUrl} alt={blog.title} className="w-full object-cover" />
            </div>
          )}
          
          {/* Professional Typography styling using Tailwind */}
          <div 
            className="prose prose-invert prose-lg md:prose-xl max-w-none 
                       prose-headings:font-bold prose-headings:text-white 
                       prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2
                       prose-h3:text-2xl prose-h3:mt-8
                       prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                       prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-a:underline-offset-4
                       prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-slate-800
                       prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-xl prose-pre:p-6 prose-pre:rounded-xl
                       prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                       prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-900/50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:font-normal prose-blockquote:italic prose-blockquote:text-slate-300
                       prose-li:text-slate-300"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
          
          {/* Tags (Bottom) */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-slate-800 flex flex-wrap gap-3 items-center">
              <span className="text-sm font-semibold text-slate-500">TAGGED IN:</span>
              {blog.tags.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-full text-sm font-medium hover:border-indigo-500/50 transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Box */}
          <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 p-[3px] flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {blog.author ? blog.author.charAt(0) : 'D'}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Written by {blog.author || 'Dynamic Translator Team'}</h3>
                <p className="text-slate-400">Building the fastest and most reliable translation APIs for developers. We love sharing our knowledge about internationalization, app development, and scaling SaaS products.</p>
              </div>
          </div>

          {/* Mobile Share (Bottom) */}
          <div className="mt-8 flex md:hidden items-center justify-center gap-4 bg-slate-900/50 py-4 rounded-xl border border-slate-800">
             <span className="text-sm font-semibold text-slate-500 uppercase">Share:</span>
             <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${blog.title}`} className="text-[#1DA1F2] hover:text-white transition-colors">
               Twitter
             </a>
             <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${blog.title}`} className="text-[#0077b5] hover:text-white transition-colors">
               LinkedIn
             </a>
          </div>
        </article>
      </main>

      {/* Call to Action Footer specific to API */}
      <section className="bg-slate-900 border-y border-slate-800 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Start Translating Your App Today</h2>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Get your free API key now and experience lightning-fast localization for your Web and Flutter applications.</p>
        <a href="/#playground" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/25 transition-all inline-block">Get Your Free API Key</a>
      </section>

      <Footer />
    </div>
  );
}
