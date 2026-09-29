import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Playground from './components/Playground';
import KeyGenerator from './components/KeyGenerator';
import BalanceChecker from './components/BalanceChecker';
import Pricing from './components/Pricing';
import CodeSnippets from './components/CodeSnippets';
import LegalPolicies from './components/LegalPolicies';
import Footer from './components/Footer';

export default function App() {
  const [apiKey, setApiKey] = useState("dt_live_demo12345");

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
        <Playground apiKey={apiKey} setApiKey={setApiKey} />
        <KeyGenerator onKeyGenerated={(newKey) => setApiKey(newKey)} />
        <BalanceChecker apiKey={apiKey} setApiKey={setApiKey} />
        <Pricing onScrollTo={scrollToSection} />
        <CodeSnippets />
      </main>

      <LegalPolicies />
      <Footer />
    </div>
  );
}
