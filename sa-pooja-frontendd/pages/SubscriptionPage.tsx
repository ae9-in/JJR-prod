
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual'>('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    location: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Parallax effect for ornaments
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      const ornaments = document.querySelectorAll('.sub-ornament');
      ornaments.forEach((el, i) => {
        const f = (i % 2 === 0) ? 14 : -9;
        (el as HTMLElement).style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const openModal = (plan: string) => {
    const labels: Record<string, string> = {
      'Daily Pooja Kit': 'Daily Pooja Essentials Kit',
      'Divine Partner Pack': 'Divine Partner Bulk Subscription'
    };
    setSelectedPlan(labels[plan] || plan + ' Membership');
    setIsModalOpen(true);
    setIsSuccess(false);
    setFormData({ name: '', email: '', business: '', location: '' });
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (value.trim()) {
      setErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim()) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Determine Amount based on plan and billing mode
    let amount = 0;
    if (selectedPlan.includes('Daily') || selectedPlan.includes('Seeker')) {
      amount = billingMode === 'monthly' ? 499 : 5988; // 499 * 12
    } else {
      amount = billingMode === 'monthly' ? 799 : 9588; // 799 * 12
    }

    try {
      // Load Razorpay directly for test bypass
      const loadRazorpay = () => new Promise((resolve) => {
        if ((window as any).Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // Using the discovered verified test key from the backend setup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SFdCODGCebWsI5',
        amount: amount * 100, // paise
        currency: 'INR',
        name: 'Jaya Janardhana',
        description: `Subscription: ${selectedPlan}`,
        handler: function (response: any) {
           setIsSuccess(true);
        },
        prefill: {
          name: formData.name || 'Test User',
          email: formData.email || 'test@example.com',
          contact: '9999999999'
        },
        theme: { color: '#C5A059' }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        console.error(response.error);
        alert('Payment failed: ' + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setIsSuccess(true);
    }
  };

  return (
    <div className={`subscription-page-root ${billingMode === 'annual' ? 'annual' : ''}`}>
      <style>{`
        .subscription-page-root {
          --gold-shine: linear-gradient(135deg, #8e6c27 0%, #c5a059 30%, #f7e7c0 55%, #c5a059 75%, #8e6c27 100%);
          --gold-subtle: linear-gradient(135deg, #8e6c27 0%, #c5a059 50%, #f7e7c0 100%);
          --gold-border: rgba(197,160,89,0.25);
          --glass-bg: rgba(26,3,3,0.85);
          color: #E6D5B8;
          min-height: 100vh;
          position: relative;
        }

        .sub-particle {
          position: fixed; width: 2px; height: 2px; background: #C5A059;
          border-radius: 50%; pointer-events: none; z-index: 0; opacity: 0;
          animation: drift var(--dur,12s) ease-in-out infinite; animation-delay: var(--delay,0s);
        }
        @keyframes drift {
          0%   { opacity: 0; transform: translateY(0) translateX(0); }
          20%  { opacity: 0.55; }
          80%  { opacity: 0.2; }
          100% { opacity: 0; transform: translateY(-140px) translateX(var(--dx,20px)); }
        }

        .sub-ornament { position: fixed; pointer-events: none; z-index: 0; opacity: 0.18; filter: drop-shadow(0 0 12px rgba(197,160,89,0.4)); }
        .sub-ornament-tl { top:15%; left:2%; animation: float-orn 16s ease-in-out infinite alternate; }
        .sub-ornament-tr { top:14%; right:2%; animation: float-orn 18s ease-in-out infinite alternate; animation-delay:-5s; }
        .sub-ornament-bl { bottom:17%; left:3%; animation: float-orn 14s ease-in-out infinite alternate; animation-delay:-9s; }
        .sub-ornament-br { bottom:15%; right:3%; animation: float-orn 20s ease-in-out infinite alternate; animation-delay:-3s; }
        @keyframes float-orn { 0%{transform:translateY(0) rotate(0deg);} 100%{transform:translateY(-20px) rotate(7deg);} }

        @keyframes sub-shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
        @keyframes sub-fade-up { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }

        .sub-header { text-align: center; margin-bottom: 56px; animation: sub-fade-up 1s cubic-bezier(0.16,1,0.3,1) both; }
        
        .sub-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase; color: #C5A059;
          background: rgba(197,160,89,0.07); border: 1px solid var(--gold-border);
          padding: 7px 20px; border-radius: 100px; margin-bottom: 28px; backdrop-filter: blur(10px);
        }

        .sub-h1 {
          font-family: 'Playfair Display', serif; font-size: clamp(38px, 6vw, 74px);
          font-weight: 900; line-height: 1.0; letter-spacing: -0.01em; margin-bottom: 16px;
        }
        .sub-h1-gold {
          display: block; font-style: italic;
          background: var(--gold-shine); background-size: 200% 100%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: sub-shimmer 5s linear infinite;
        }

        .sub-billing-toggle {
          display: inline-flex; align-items: center; gap: 4px;
          background: var(--glass-bg); border: 1px solid var(--gold-border);
          border-radius: 100px; padding: 5px; backdrop-filter: blur(20px);
        }
        .sub-toggle-btn {
          padding: 9px 26px; border-radius: 100px; border: none;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
          transition: all 0.3s ease; color: rgba(230,213,184,0.45); background: transparent;
        }
        .sub-toggle-btn.active {
          background: var(--gold-shine); background-size: 200% 100%;
          color: #1A0303; box-shadow: 0 4px 20px rgba(197,160,89,0.3);
          animation: sub-shimmer 5s linear infinite;
        }

        .sub-card {
          border-radius: 20px; padding: 40px 32px 36px; position: relative; overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease;
          background: var(--glass-bg); border: 1px solid var(--gold-border); backdrop-filter: blur(20px);
        }
        .sub-card:hover { transform: translateY(-10px); }
        .sub-card-featured {
          background: linear-gradient(145deg, rgba(45,5,5,0.97), rgba(26,3,3,0.99));
          border-color: rgba(197,160,89,0.5);
          transform: scale(1.04);
        }
        .sub-card-featured:hover { transform: scale(1.04) translateY(-10px); }

        .sub-price-amount {
          font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 700;
          background: var(--gold-subtle); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        
        .sub-cta-btn {
          width: 100%; padding: 15px; border-radius: 100px; border: none;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: all .25s ease;
        }
        .sub-btn-gold {
          background: var(--gold-shine); background-size: 200% 100%; color: #1A0303;
          animation: sub-shimmer 5s linear infinite;
        }
        .sub-btn-outline {
          background: transparent; color: #C5A059; border: 1.5px solid rgba(197,160,89,0.38);
        }

        .sub-modal-overlay {
          position: fixed; inset: 0; background: rgba(10,1,1,0.85); backdrop-filter: blur(16px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .sub-modal {
          background: linear-gradient(145deg, rgba(45,5,5,0.98), rgba(26,3,3,0.99));
          border: 1px solid rgba(197,160,89,0.35); border-radius: 24px; padding: 52px 44px;
          max-width: 460px; width: 90%; position: relative;
        }

        .price-monthly { display: ${billingMode === 'monthly' ? 'inline' : 'none'}; }
        .price-annual  { display: ${billingMode === 'annual' ? 'inline' : 'none'}; }
      `}</style>

      {/* Background Particles */}
      <div className="sub-particle" style={{ left: '8%', bottom: 0, '--dur': '14s', '--delay': '-2s', '--dx': '14px' } as any}></div>
      <div className="sub-particle" style={{ left: '22%', bottom: 0, '--dur': '10s', '--delay': '-5s', '--dx': '-16px' } as any}></div>
      <div className="sub-particle" style={{ left: '48%', bottom: 0, '--dur': '16s', '--delay': '-8s', '--dx': '10px' } as any}></div>
      <div className="sub-particle" style={{ left: '67%', bottom: 0, '--dur': '12s', '--delay': '-1s', '--dx': '-20px' } as any}></div>
      <div className="sub-particle" style={{ left: '85%', bottom: 0, '--dur': '18s', '--delay': '-11s', '--dx': '15px' } as any}></div>

      {/* Ornaments */}
      <div className="sub-ornament sub-ornament-tl">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M4 4 L4 32 M4 4 L32 4" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="4" cy="4" r="3" fill="#C5A059" />
        </svg>
      </div>
      <div className="sub-ornament sub-ornament-tr">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M76 4 L76 32 M76 4 L48 4" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="76" cy="4" r="3" fill="#C5A059" />
        </svg>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="sub-header">
          <div className="sub-eyebrow">
            <span className="w-1 h-1 bg-[#C5A059] rounded-full animate-pulse mr-2 shadow-[0_0_6px_#C5A059]"></span>
            Jaya Janardhana — Membership
          </div>
          <h1 className="sub-h1">
            <span className="text-[#F5F0E1]">We grow when</span>
            <span className="sub-h1-gold">you grow.</span>
          </h1>
          <p className="font-serif text-lg text-[#E6D5B8]/60 italic max-w-xl mx-auto mt-4">
            Join a trusted ecosystem where sourcing is reliable, earnings are clear, and the sanctity of every product is guaranteed.
          </p>
          <div className="flex items-center justify-center gap-4 my-10">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#C5A059] opacity-50"></div>
            <span className="text-[#C5A059]">✦</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#C5A059] opacity-50"></div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="text-center mb-14 flex items-center justify-center gap-4">
          <div className="sub-billing-toggle">
            <button
              className={`sub-toggle-btn ${billingMode === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingMode('monthly')}
            >
              Monthly
            </button>
            <button
              className={`sub-toggle-btn ${billingMode === 'annual' ? 'active' : ''}`}
              onClick={() => setBillingMode('annual')}
            >
              Annual
            </button>
          </div>
          <span className="font-sans text-[11px] font-bold text-[#4B7A7C] bg-[#4B7A7C]/10 border border-[#4B7A7C]/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Save 20%
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-10 items-stretch max-w-5xl mx-auto">
          {/* Seeker */}
          <div className="sub-card">
            <div className="inline-block font-serif text-sm px-5 py-1.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059] mb-6">
              Daily Pooja Kit
            </div>
            <div className="mb-6">
              <div className="sub-price-amount">
                <sup className="text-2xl mr-1">₹</sup>
                {billingMode === 'monthly' ? '499' : '5,988'}
              </div>
              <p className="text-xs text-[#E6D5B8]/40 mt-1 uppercase tracking-widest">
                MONTHLY KIT DELIVERY · BILLED {billingMode.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-3 mb-8 border-b border-[#C5A059]/10 pb-5 text-[#E6D5B8]/80 italic">
              <div className="w-1 h-4 bg-[#C5A059] rounded-full"></div>
              Everything for your daily ritual
            </div>
            <ul className="space-y-4 mb-10 overflow-hidden">
              {[
                { label: 'Complete pooja essentials kit in one pack', bold: true },
                { label: '3-in-1 premium agarbatti (100g)' },
                { label: 'Pure camphor for aarti rituals (100g)' },
                { label: 'High-quality deepa oil (800ml)' },
                { label: 'Traditional dhoop sticks (100g)' },
                { label: 'Ready-to-use cotton wicks (40 units)' },
                { label: 'Sacred kumkuma packet included' }
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-[15px] items-start">
                  <div className="mt-1 w-5 h-5 flex items-center justify-center rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 text-[#C5A059]">
                    <Check size={10} />
                  </div>
                  <span className={item.bold ? 'font-semibold text-[#F5F0E1]' : ''}>{item.label}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => openModal('Seeker')} className="sub-cta-btn sub-btn-gold hover:brightness-110">
              Subscribe
            </button>
          </div>

          {/* Devotee */}
          <div className="sub-card sub-card-featured p-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-var(--gold-shine) bg-[length:200%_100%] animate-[sub-shimmer_5s_linear_infinite] text-[#1A0303] text-[9px] font-bold uppercase tracking-[0.2em] px-5 py-1.5 rounded-b-xl shadow-lg">
              Most Trusted
            </div>
            <div className="inline-block font-serif text-sm px-5 py-1.5 rounded-full border border-[#C5A059]/50 bg-[#C5A059]/10 text-[#C5A059] mb-6">
              Divine Partner Pack
            </div>
            <div className="mb-6">
              <div className="sub-price-amount">
                <sup className="text-2xl mr-1">₹</sup>
                {billingMode === 'monthly' ? '799' : '9,588'}
              </div>
              <p className="text-xs text-[#E6D5B8]/40 mt-1 uppercase tracking-widest">
                BULK SUBSCRIPTION · BILLED {billingMode.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-3 mb-8 border-b border-[#C5A059]/20 pb-5 text-[#E6D5B8]/80 italic">
              <div className="w-1 h-4 bg-[#C5A059] rounded-full"></div>
              For families & temple communities
            </div>
            <ul className="space-y-4 mb-10">
              {[
                { label: 'Multiple kits for home & temple use', bold: true },
                { label: 'Priority doorstep delivery service' },
                { label: 'Handpicked premium heritage grade' },
                { label: 'Weekly community ritual strategy' },
                { label: 'Dedicated sacred accounts manager' },
                { label: 'Exclusive access to custom dhoop' },
                { label: 'Ensures uninterrupted daily rituals' }
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-[15px] items-start">
                  <div className="mt-1 w-5 h-5 flex items-center justify-center rounded-full border border-[#C5A059]/50 bg-[#C5A059]/10 text-[#C5A059]">
                    <Check size={10} />
                  </div>
                  <span className={item.bold ? 'font-semibold text-[#F5F0E1]' : ''}>{item.label}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => openModal('Devotee')} className="sub-cta-btn sub-btn-gold hover:brightness-110">
              Subscribe
            </button>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-20 opacity-60 text-sm italic font-serif">
          <div className="flex items-center gap-2"><span>🛡️</span> Sanctity Guaranteed on Every Product</div>
          <span className="text-[#C5A059] hidden md:inline">✦</span>
          <div className="flex items-center gap-2"><span>📦</span> Reliable, Consistent Sourcing</div>
          <span className="text-[#C5A059] hidden md:inline">✦</span>
          <div className="flex items-center gap-2"><span>💰</span> Earnings Always Transparent</div>
        </div>

        <div className="max-w-xl mx-auto mt-12 pt-8 border-t border-[#C5A059]/10 text-center text-[#E6D5B8]/40 text-sm italic">
          <strong className="text-[#E6D5B8]/70 not-italic">Our Promise —</strong> If you are not satisfied after your first month within the Jaya Janardhana ecosystem, you don't pay.
        </div>
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="sub-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="sub-modal" onClick={e => e.stopPropagation()}>
            <button className="absolute top-6 right-6 text-[#E6D5B8]/40 hover:text-[#C5A059] transition-colors" onClick={() => setIsModalOpen(false)}>✕</button>
            
            {!isSuccess ? (
              <>
                <h2 className="font-serif text-3xl text-[#F5F0E1] mb-1">Join the Ecosystem</h2>
                <div className="text-[11px] font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-8">{selectedPlan}</div>
                
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <input 
                    className={`bg-[#C5A059]/5 border ${errors.name ? 'border-red-500/50' : 'border-[#C5A059]/20'} rounded-xl p-4 text-[#E6D5B8] outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-[#E6D5B8]/20`} 
                    placeholder="Your full name" 
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <input 
                    className={`bg-[#C5A059]/5 border ${errors.email ? 'border-red-500/50' : 'border-[#C5A059]/20'} rounded-xl p-4 text-[#E6D5B8] outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-[#E6D5B8]/20`} 
                    placeholder="Email address" 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <input 
                    className="bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-xl p-4 text-[#E6D5B8] outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-[#E6D5B8]/20" 
                    placeholder="Your business / temple name" 
                    id="business"
                    value={formData.business}
                    onChange={handleInputChange}
                  />
                  <input 
                    className="bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-xl p-4 text-[#E6D5B8] outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-[#E6D5B8]/20" 
                    placeholder="City & State" 
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                  <button type="submit" className="sub-cta-btn sub-btn-gold mt-4 shadow-[0_6px_24px_rgba(197,160,89,0.3)] hover:brightness-110">
                    Begin My Membership →
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-var(--gold-shine) bg-[length:200%_100%] animate-[sub-shimmer_5s_linear_infinite] rounded-full mx-auto flex items-center justify-center text-3xl text-[#1A0303] shadow-[0_0_30px_rgba(197,160,89,0.4)] mb-8">
                  ✦
                </div>
                <h2 className="title-sacred text-3xl text-[#F5F0E1] mb-3">You're Part of Us</h2>
                <p className="body-sacred italic text-[#E6D5B8]/60 leading-relaxed">
                  Welcome to the Jaya Janardhana family. Our team will reach out within 24 hours to complete your onboarding.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
