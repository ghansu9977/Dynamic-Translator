import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function SEOContent() {
  return (
    <motion.section 
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-16"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6">Your Ultimate Language Translator Solution</h2>
        <div className="space-y-6 text-slate-300">
          <p>
            Whether you are looking for an <strong>online translator</strong> for your documents or a powerful <strong>language translation API</strong> for your software, Dynamic Translator API is the top choice. Our AI-powered engine works seamlessly to <strong>translate English to Hindi, Spanish, Marathi, Tagalog</strong>, and over 100+ global languages in real-time.
          </p>
          <p>
            Forget about unreliable, slow, or expensive translation agencies. As the <strong>best language translator API</strong> for developers, we empower you to build a <strong>translate app</strong> or perform <strong>website translation</strong> instantly. Our <strong>text translation API</strong> allows <strong>text to text translation</strong> across a multitude of formats including JSON, YAML, and raw strings.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-bold text-indigo-400 mb-3">Why Use Our Translate Service?</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Machine Translation Accuracy:</strong> Backed by advanced AI for natural sounding translations.</li>
                <li><strong>Document Translation:</strong> Easily script translations for massive file assets.</li>
                <li><strong>Real-Time Localization:</strong> Make your mobile apps global instantly.</li>
                <li><strong>Global Translation Support:</strong> From Asian to European languages, all text formats supported.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-indigo-400 mb-3">Who is this for?</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Developers building a <strong>mobile app translator</strong>.</li>
                <li>Businesses needing bulk <strong>text translation</strong>.</li>
                <li>Enterprises seeking an alternative to the standard Google Translate API.</li>
                <li>Teams focusing on automated <strong>app localization</strong> workflows.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
