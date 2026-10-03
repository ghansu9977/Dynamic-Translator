import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Blog() {
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
        
        <article className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 hover:border-indigo-500/50 transition-all duration-300 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">How to Add Multi-Language Support to Your Flutter App</h2>
          <p className="text-indigo-400 mb-6 text-sm font-semibold tracking-wide uppercase">October 3, 2026 • 5 min read</p>
          <p className="text-slate-300 leading-relaxed mb-6 text-lg">
            In today's global market, translating your mobile application is no longer optional—it's a necessity. 
            Flutter developers often struggle with managing localizations manually. The Dynamic Translator API 
            solves this by providing real-time translations for JSON and YAML files directly from your CI/CD pipeline or app runtime.
          </p>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Why choose an API over static files?</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-3 mb-8 text-lg">
            <li>Instant updates without App Store or Play Store releases</li>
            <li>Cost-effective compared to manual translation agencies</li>
            <li>Supports over 100+ languages including Hindi, Marathi, Tagalog, and more</li>
          </ul>
          <a href="/#playground" className="text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-colors">
            Try the API Playground <span>→</span>
          </a>
        </article>

        <article className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 hover:border-indigo-500/50 transition-all duration-300 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Best Alternatives to Google Translate API in 2026</h2>
          <p className="text-indigo-400 mb-6 text-sm font-semibold tracking-wide uppercase">September 28, 2026 • 4 min read</p>
          <p className="text-slate-300 leading-relaxed mb-6 text-lg">
            If you are building a commercial SaaS, relying on free translation wrappers is risky. You need a stable, scalable 
            commercial translation API. Dynamic Translator offers a pay-as-you-go model that is cheaper than major cloud providers 
            while offering developer-friendly tools like instant API keys and a dashboard.
          </p>
          <a href="/#pricing" className="text-white border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-all">
            View Pricing <span>→</span>
          </a>
        </article>
      </main>
      <Footer />
    </div>
  );
}
