
import React from 'react';
import { ShieldCheck, ArrowRight, Flame, Bell, Wind, TrendingUp, Package, Users, ChevronRight, Info } from 'lucide-react';
import SacredFrame from '../components/SacredFrame';


const HomePage: React.FC = () => {
  return (
    <div className="relative pb-40">
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="relative z-10 max-w-5xl fade-in-ritual flex flex-col items-center">
          <div className="flex items-center gap-4 mb-10 bg-[#C5A059]/10 border border-[#C5A059]/20 px-8 py-3 rounded-full backdrop-blur-lg">
            <ShieldCheck size={18} className="text-[#C5A059]" />
            <span className="label-sacred text-[0.6rem] text-[#C5A059] font-bold tracking-[0.5em]">Heritage Community Marketplace</span>
          </div>

          <h1 className="h1-sacred text-5xl md:text-8xl mb-8 tracking-tighter leading-none shimmer-base text-shimmer-hero glow-gold-metallic">
            The Source for <br /><span className="italic">Sacred Distribution.</span>
          </h1>

          <div className="sandalwood-divider w-60 mx-auto mb-10 opacity-40"></div>

          <p className="body-sacred text-lg md:text-2xl text-[#E6D5B8]/80 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
            We bridge the gap between traditional craftsmanship and independent distributors. High-integrity sourcing, guaranteed margins, communal trust.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-8 mt-2">
            <button
              onClick={() => window.location.hash = '/register'}
              className="cta-gold py-6 px-14 text-[0.85rem] group shadow-[0_0_30px_rgba(197,160,89,0.15)]"
            >
              Start as an Affiliate
              <ArrowRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform inline-block text-[#1A0303]" />
            </button>

            {/* View Catalog button removed for affiliate site focus */}
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-60">
            <div className="flex items-center gap-3">
              <Flame size={18} className="text-[#C5A059]" />
              <span className="label-sacred text-[0.55rem] text-[#E6D5B8] tracking-[0.3em]">Direct Sourcing</span>
            </div>
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-[#C5A059]" />
              <span className="label-sacred text-[0.55rem] text-[#E6D5B8] tracking-[0.3em]">Member Margins</span>
            </div>
            <div className="flex items-center gap-3">
              <Wind size={18} className="text-[#C5A059]" />
              <span className="label-sacred text-[0.55rem] text-[#E6D5B8] tracking-[0.3em]">Shared Logistics</span>
            </div>
          </div>
        </div>
      </section>



      {/* Feature Section Layered over Sandalwood */}
      <section className="relative py-32 mt-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>
        <div className="max-w-[1200px] mx-auto px-10 relative z-10 grid md:grid-cols-1 gap-12 text-center">
          {[
            {
              title: "Community Trust",
              desc: "Join a network of poojaris and local resellers. We succeed when our collective community thrives.",
              btn: "Partner Portal",
              path: "/dashboard",
              icon: <Users className="text-[#C5A059]" />
            }
          ].map((action, i) => (
            <SacredFrame key={i} className="p-12 bg-[#1A0303]/90 group hover:border-[#C5A059]/60 transition-all border-[#E6D5B8]/5 max-w-md mx-auto">
              <div className="w-14 h-14 bg-[#2D0505] border border-[#C5A059]/20 flex items-center justify-center rounded-sm mb-10 group-hover:scale-110 transition-transform duration-500 mx-auto">
                {action.icon}
              </div>
              <h3 className="h1-sacred text-xl font-bold mb-5 tracking-tight text-[#F5F0E1] glow-gold-solid">{action.title}</h3>
              <p className="body-sacred text-base text-[#E6D5B8]/60 mb-12 leading-relaxed font-light">{action.desc}</p>
              <button
                onClick={() => window.location.hash = action.path}
                className="label-sacred text-[0.6rem] text-[#C5A059] font-bold flex items-center gap-3 border-b border-[#C5A059]/30 pb-2 hover:border-[#C5A059] transition-all glow-gold-cta mx-auto"
              >
                {action.btn}
                <ChevronRight size={14} />
              </button>
            </SacredFrame>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
