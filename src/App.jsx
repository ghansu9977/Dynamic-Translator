import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Playground from './components/Playground';
import KeyGenerator from './components/KeyGenerator';
import Pricing from './components/Pricing';
import CodeSnippets from './components/CodeSnippets';
import LegalPolicies from './components/LegalPolicies';
import Footer from './components/Footer';
import SEOContent from './components/SEOContent';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import UserDashboard from './pages/UserDashboard';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("dt_user_api_key") || "");

  // Track pageview in Google Analytics on route load
  React.useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-KHNBCZ0Q3Q', {
        page_path: window.location.pathname + window.location.search
      });
    }
  }, []);

  // Simple routing for Admin Dashboard
  if (window.location.pathname === '/admin') {
    return <AdminDashboard />;
  }
  
  if (window.location.pathname === '/blog' || window.location.pathname === '/blog/') {
    return <Blog />;
  }

  // Handle dynamic individual blog pages (e.g., /blog/my-first-post)
  if (window.location.pathname.startsWith('/blog/')) {
    return <BlogDetail />;
  }

  if (window.location.pathname === '/dashboard') {
    return <UserDashboard />;
  }

  const handleKeyGenerated = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem("dt_user_api_key", newKey);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden w-full">
      <Navbar onScrollTo={scrollToSection} />
      <Hero onScrollTo={scrollToSection} />

      <main class="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-24 flex-grow w-full">
        {/* Trusted By Section */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="py-8 border-y border-white/10 my-10 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-500"
        >
          <p className="text-sm text-slate-400 font-semibold tracking-widest uppercase mb-6 text-center">Trusted by modern engineering teams</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center filter grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {/* Dummy Logos */}
            <div className="flex items-center gap-2 text-xl font-bold font-mono"><div className="w-6 h-6 rounded bg-indigo-500"></div> TechFlow</div>
            <div className="flex items-center gap-2 text-xl font-bold font-mono"><div className="w-6 h-6 rounded-full bg-emerald-500"></div> NexusApp</div>
            <div className="flex items-center gap-2 text-xl font-bold font-mono"><div className="w-6 h-6 rotate-45 bg-rose-500"></div> Polyglot Inc</div>
            <div className="flex items-center gap-2 text-xl font-bold font-mono"><div className="w-6 h-6 rounded-tl-xl rounded-br-xl bg-blue-500"></div> Globex</div>
          </div>
        </motion.div>

        <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
          <Playground apiKey={apiKey} setApiKey={setApiKey} />
        </motion.div>

        <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
          <KeyGenerator apiKey={apiKey} onKeyGenerated={handleKeyGenerated} />
        </motion.div>
        

        <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
          <Pricing onScrollTo={scrollToSection} />
        </motion.div>

        {apiKey && (
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
            <CodeSnippets apiKey={apiKey} />
          </motion.div>
        )}
      </main>

      <SEOContent />
      <LegalPolicies />
      <Footer />
    </div>
  );
}
