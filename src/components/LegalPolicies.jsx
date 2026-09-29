import React, { useState } from 'react';

export default function LegalPolicies() {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | 'refund' | 'contact'
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'api_help', message: '' });

  const closeModal = () => {
    setActiveModal(null);
    setContactSubmitted(false);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields.");
      return;
    }
    setContactSubmitted(true);
  };

  return (
    <>
      {/* Footer Legal Links Bar */}
      <div class="border-t border-slate-900 bg-slate-950 py-4 px-6 text-xs text-slate-400">
        <div class="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 font-medium">
          <button onClick={() => setActiveModal('privacy')} class="hover:text-indigo-400 underline transition">Privacy Policy</button>
          <button onClick={() => setActiveModal('terms')} class="hover:text-indigo-400 underline transition">Terms & Conditions</button>
          <button onClick={() => setActiveModal('refund')} class="hover:text-indigo-400 underline transition">Refund & Cancellation Policy</button>
          <button onClick={() => setActiveModal('contact')} class="hover:text-indigo-400 underline transition">Contact Support</button>
        </div>
      </div>

      {/* Modal Popup Container */}
      {activeModal && (
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl p-6 border border-slate-700 shadow-2xl relative text-slate-200">
            <button 
              onClick={closeModal} 
              class="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            {/* Privacy Policy */}
            {activeModal === 'privacy' && (
              <div class="space-y-4">
                <h2 class="text-xl font-bold text-white border-b border-slate-800 pb-2">Privacy Policy</h2>
                <p class="text-xs text-slate-400">Last updated: September 2026</p>
                <p class="text-sm">Dynamic Translator API respects your privacy. We collect minimal information required to provide our translation services.</p>
                <h3 class="font-semibold text-indigo-400 text-sm">1. Data Collection</h3>
                <p class="text-xs text-slate-300">We collect your name, email address, and API usage stats (words count and target languages) to manage your account quotas.</p>
                <h3 class="font-semibold text-indigo-400 text-sm">2. Data Security</h3>
                <p class="text-xs text-slate-300">Your API keys are encrypted. We do not store or sell your translated text content to third parties.</p>
              </div>
            )}

            {/* Terms & Conditions */}
            {activeModal === 'terms' && (
              <div class="space-y-4">
                <h2 class="text-xl font-bold text-white border-b border-slate-800 pb-2">Terms & Conditions</h2>
                <p class="text-xs text-slate-400">Last updated: September 2026</p>
                <p class="text-sm">By using Dynamic Translator API services, you agree to comply with our fair use guidelines.</p>
                <h3 class="font-semibold text-indigo-400 text-sm">1. API Key Responsibility</h3>
                <p class="text-xs text-slate-300">You are responsible for maintaining the confidentiality of your API key. Unauthorized bulk spamming is prohibited.</p>
                <h3 class="font-semibold text-indigo-400 text-sm">2. Service Quotas</h3>
                <p class="text-xs text-slate-300">Free tier accounts are limited to 5,000 words per month. Upgrades apply immediately upon successful payment verification.</p>
              </div>
            )}

            {/* Refund & Cancellation Policy */}
            {activeModal === 'refund' && (
              <div class="space-y-4">
                <h2 class="text-xl font-bold text-white border-b border-slate-800 pb-2">Refund & Cancellation Policy</h2>
                <p class="text-xs text-slate-400">Last updated: September 2026</p>
                <h3 class="font-semibold text-indigo-400 text-sm">1. Strict No-Refund Policy</h3>
                <p class="text-xs text-slate-300">Due to the instant digital nature of API credit allocations and server resource provisioning, all subscription payments, word quota purchases, and API top-ups are strictly non-refundable once activated.</p>
                <h3 class="font-semibold text-indigo-400 text-sm">2. Try Before You Buy (Free Tier)</h3>
                <p class="text-xs text-slate-300">We offer a Free Tier with 5,000 words quota every month so developers can thoroughly test our translation API performance before making any paid purchases.</p>
                <h3 class="font-semibold text-indigo-400 text-sm">3. Plan Cancellation</h3>
                <p class="text-xs text-slate-300">You can cancel your subscription at any time. Your existing word balance will remain active until the end of your billing cycle.</p>
              </div>
            )}

            {/* Contact Us Interactive Form */}
            {activeModal === 'contact' && (
              <div class="space-y-4">
                <h2 class="text-xl font-bold text-white border-b border-slate-800 pb-2">Contact Support</h2>
                <p class="text-xs text-slate-400">Have questions or need help with your API integration? Send us a direct message below.</p>

                {contactSubmitted ? (
                  <div class="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-2">
                    <div class="text-lg font-bold text-emerald-400">🎉 Message Sent Successfully!</div>
                    <p class="text-xs text-slate-300">Thank you for reaching out. Our technical support team will reply to <strong>{formData.email}</strong> within 24 hours.</p>
                    <button onClick={closeModal} class="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition">
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} class="space-y-3">
                    <div>
                      <label class="block text-xs font-semibold text-slate-400 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Alex Chen"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-slate-400 mb-1">Topic</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      >
                        <option value="api_help">API Integration Support</option>
                        <option value="billing">Sales & Pricing Inquiry</option>
                        <option value="quota">Quota Upgrade / Quota Increase</option>
                        <option value="other">General Question</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-slate-400 mb-1">Your Message</label>
                      <textarea 
                        rows="4" 
                        placeholder="Write your question or request here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-sans"
                        required
                      ></textarea>
                    </div>

                    <div class="flex justify-between items-center pt-2">
                      <span class="text-[11px] text-slate-500">📧 Official Support: support@dynamic-translator.com</span>
                      <button 
                        type="submit"
                        class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
