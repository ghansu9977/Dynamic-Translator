import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, plan, amount }) {
  const [formData, setFormData] = useState({ name: '', email: '', apiKey: '' });
  const [loading, setLoading] = useState(false);
  const [successKey, setSuccessKey] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Name and Email are required.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // 1. Create order
      const orderRes = await fetch('https://translater-free-api.onrender.com/api/v1/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const orderData = await orderRes.json();
      
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create order');

      // 2. Initialize Razorpay
      const options = {
        key: "rzp_live_ThoBHwVrNMgDyg", // Live key
        amount: orderData.order.amount,
        currency: "INR",
        name: "Dynamic Translator",
        description: `Upgrade to ${plan.toUpperCase()} Plan`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // 3. Verify Payment
          try {
            setLoading(true);
            const verifyRes = await fetch('https://translater-free-api.onrender.com/api/v1/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                name: formData.name,
                email: formData.email,
                existingApiKey: formData.apiKey,
                plan: plan
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setSuccessKey(verifyData.apiKey);
            } else {
              setError(verifyData.error || "Payment verification failed.");
            }
          } catch (err) {
            setError("Error verifying payment.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        setError(response.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      setError(err.message || "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-1">Upgrade to {plan.toUpperCase()}</h3>
          <p className="text-slate-400 text-sm mb-6">Complete your payment of ₹{amount} to activate plan.</p>

          {successKey ? (
            <div className="bg-emerald-900/30 border border-emerald-500/50 p-4 rounded-xl text-center space-y-3">
              <div className="text-emerald-400 font-bold">Payment Successful! 🎉</div>
              <p className="text-slate-300 text-sm">Your new Premium API Key is:</p>
              <div className="bg-slate-950 p-3 rounded text-indigo-300 font-mono text-sm break-all">
                {successKey}
              </div>
              <p className="text-xs text-slate-400 mt-2">Please copy and save this key safely. It's active now!</p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-4">
              {error && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">{error}</div>}
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Existing API Key (Optional)</label>
                <input type="text" name="apiKey" value={formData.apiKey} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" placeholder="dt_live_..." />
                <p className="text-[10px] text-slate-500 mt-1">If you have a free key, enter it to upgrade it directly.</p>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-center font-bold text-sm text-white shadow-lg shadow-indigo-600/40 transition mt-4 flex items-center justify-center gap-2">
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Processing...' : `Pay ₹${amount}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
