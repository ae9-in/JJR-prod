
import React from 'react';
import { ArrowRight, CheckCircle, Calculator, ShieldCheck } from 'lucide-react';
import SacredFrame from '../components/SacredFrame';

const MarginsPage: React.FC = () => {
  return (
    <div className="relative pb-40 fade-in-ritual">
        {/* Hero Section */}
        <section className="py-32 px-6 text-center max-w-4xl mx-auto relative z-10">
            <h1 className="h1-sacred text-4xl md:text-6xl text-[#F5F0E1] glow-gold-metallic mb-8 leading-tight">
                How You Earn as a <br/>Jaya Janardhana Affiliate
            </h1>
            <div className="sandalwood-divider w-24 mx-auto mb-10 opacity-40"></div>
            <p className="body-sacred text-xl text-[#E6D5B8]/80 leading-relaxed font-light mb-12">
                Earn up to 35% commission on verified pooja and spiritual products through transparent member pricing.
            </p>
             <button
              onClick={() => window.location.hash = '/register'}
              className="cta-gold py-5 px-12 text-[0.8rem] group shadow-[0_0_20px_rgba(197,160,89,0.15)] inline-flex items-center gap-3"
            >
              Start as an Affiliate
              <ArrowRight size={18} className="text-[#1A0303]" />
            </button>
        </section>

        {/* Section 1: Commission Model */}
        <section className="py-20 px-6 max-w-[1200px] mx-auto">
             <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div>
                    <h2 className="h1-sacred text-3xl text-[#F5F0E1] mb-8 glow-gold-solid">Simple & Transparent Margins</h2>
                    <ul className="space-y-6">
                        {[
                            "Affiliates earn 30–35% commission per product",
                            "Margins are fixed and visible before ordering",
                            "No hidden fees or changing rates",
                            "Earnings depend on product category and quantity"
                        ].map((point, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <div className="mt-1 min-w-[20px]"><CheckCircle size={18} className="text-[#C5A059]" /></div>
                                <span className="body-sacred text-lg text-[#E6D5B8]/80">{point}</span>
                            </li>
                        ))}
                    </ul>
                 </div>
                 <div className="flex justify-center">
                     <SacredFrame className="p-12 text-center bg-[#2D0505]/50 border-[#C5A059]/30 w-full max-w-sm">
                         <span className="label-sacred text-[0.6rem] text-[#E6D5B8]/60 uppercase tracking-widest block mb-4">Flat Performance Rate</span>
                         <div className="h1-sacred text-8xl text-[#C5A059] glow-gold-metallic leading-none">35%</div>
                         <span className="label-sacred text-[0.6rem] text-[#C5A059] uppercase tracking-[0.3em] block mt-4">Average Commission</span>
                     </SacredFrame>
                 </div>
             </div>
        </section>

        {/* Section 2: How Earnings Work */}
        <section className="py-24 bg-[#1A0303]/40 border-y border-[#C5A059]/10 relative">
             <div className="max-w-[1200px] mx-auto px-6">
                 <h2 className="h1-sacred text-3xl text-center text-[#F5F0E1] mb-16 glow-gold-solid">How Earnings Work</h2>
                 <div className="grid md:grid-cols-4 gap-8">
                    {[
                        { step: "01", title: "Register", desc: "Register as an affiliate." },
                        { step: "02", title: "Browse", desc: "Browse the member catalog." },
                        { step: "03", title: "Source", desc: "Source products at member price." },
                        { step: "04", title: "Earn", desc: "Earn the margin on resale." }
                    ].map((s, i) => (
                         <div key={i} className="relative p-8 border border-[#C5A059]/10 bg-[#1A0303]/60 hover:border-[#C5A059]/30 transition-all group">
                             <span className="h1-sacred text-5xl text-[#C5A059]/5 absolute -top-4 right-4 group-hover:text-[#C5A059]/10 transition-colors select-none">{s.step}</span>
                             <h3 className="label-sacred text-[#C5A059] text-[0.7rem] uppercase tracking-widest mb-4 mt-2">{s.title}</h3>
                             <p className="body-sacred text-[#E6D5B8]/70 text-base">{s.desc}</p>
                         </div>
                    ))}
                 </div>
             </div>
        </section>

        {/* Section 3: Real Earning Example */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
             <SacredFrame className="p-10 bg-[#2D0505] border-[#C5A059]/20">
                <div className="flex items-center gap-4 mb-8 border-b border-[#C5A059]/10 pb-6">
                    <div className="p-3 bg-[#1A0303] border border-[#C5A059]/20 rounded-sm">
                        <Calculator size={24} className="text-[#C5A059]" />
                    </div>
                    <h2 className="h1-sacred text-2xl text-[#F5F0E1]">Real Earning Example</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center items-center">
                    <div>
                        <span className="label-sacred text-[0.5rem] text-[#E6D5B8]/50 uppercase tracking-widest block mb-3">Product</span>
                        <span className="h1-sacred text-xl text-[#F5F0E1]">Brass Deepam</span>
                    </div>
                    <div>
                         <span className="label-sacred text-[0.5rem] text-[#E6D5B8]/50 uppercase tracking-widest block mb-3">Member Price</span>
                        <span className="h1-sacred text-xl text-[#F5F0E1]">₹650</span>
                    </div>
                    <div>
                         <span className="label-sacred text-[0.5rem] text-[#E6D5B8]/50 uppercase tracking-widest block mb-3">Selling Price</span>
                        <span className="h1-sacred text-xl text-[#F5F0E1]">₹1,000</span>
                    </div>
                    <div className="bg-[#C5A059]/10 -m-4 p-8 flex flex-col justify-center border-l border-[#C5A059]/20 h-full">
                         <span className="label-sacred text-[0.5rem] text-[#C5A059] uppercase tracking-widest block mb-2">Affiliate Earnings</span>
                        <span className="h1-sacred text-3xl text-[#C5A059] font-bold">₹350 <span className="text-sm opacity-60 font-normal">(35%)</span></span>
                    </div>
                </div>
             </SacredFrame>
        </section>

        {/* Section 4: Who This Works For */}
        <section className="py-10 px-6 max-w-[1000px] mx-auto text-center">
            <h2 className="h1-sacred text-2xl text-[#F5F0E1] mb-12 glow-gold-solid">Who This Works For</h2>
            <div className="flex flex-wrap justify-center gap-6">
                {[
                    "Poojaris",
                    "Small Shop Owners",
                    "Community Resellers",
                    "Independent Distributors"
                ].map((role, i) => (
                    <div key={i} className="px-10 py-5 border border-[#C5A059]/20 bg-[#1A0303]/60 rounded-sm hover:bg-[#C5A059]/5 transition-colors">
                        <span className="label-sacred text-[0.65rem] text-[#C5A059] uppercase tracking-[0.2em] font-bold">{role}</span>
                    </div>
                ))}
            </div>
        </section>

         {/* Transparency Note */}
        <section className="py-20 px-6 text-center max-w-2xl mx-auto opacity-60">
             <div className="flex items-center justify-center gap-3 mb-4">
                 <ShieldCheck size={16} className="text-[#C5A059]" />
                 <span className="label-sacred text-[0.5rem] text-[#C5A059] uppercase tracking-widest">Transparency Note</span>
             </div>
             <p className="body-sacred text-sm text-[#E6D5B8]">
                 Earnings vary by product and volume. Jaya Janardhana ensures transparent pricing, not guaranteed income.
             </p>
        </section>

    </div>
  );
}

export default MarginsPage;
