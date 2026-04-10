
import React from 'react';
import { UserCheck, Store, Briefcase, Users } from 'lucide-react';
import SacredFrame from '../components/SacredFrame';

const AboutPage: React.FC = () => {
  return (
    <div className="relative pb-40 fade-in-ritual">
       {/* Hero / Intro */}
       <section className="py-32 px-6 text-center max-w-4xl mx-auto relative z-10">
          <span className="label-sacred text-[#C5A059] text-[0.55rem] tracking-[0.4em] uppercase block mb-6">Who We Are</span>
          <h1 className="h1-sacred text-5xl md:text-6xl metallic-gold-text mb-8 glow-gold-metallic">A Community-First Sourcing Platform.</h1>
          <div className="sandalwood-divider w-24 mx-auto mb-10 opacity-40"></div>
          <p className="body-sacred text-xl text-[#E6D5B8]/80 leading-relaxed font-light">
            Jaya Janardhana is a dedicated network for sourcing high-quality spiritual products. 
            We bridge the gap between traditional craftsmanship and independent distributors, ensuring transparency, reliable margins, and simplified logistics for everyone.
          </p>
       </section>

       {/* Who Can Join */}
       <section className="py-20 px-10 max-w-[1200px] mx-auto relative z-10">
          <h2 className="h1-sacred text-3xl text-center text-[#F5F0E1] mb-16 glow-gold-solid">Who Is This For?</h2>
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { icon: <UserCheck size={24} />, title: "Poojaris & Priests", desc: "Source ritual materials for your daily poojas and devotee requirements directly." },
               { icon: <Store size={24} />, title: "Small Shop Owners", desc: "Stock authentic, high-quality inventory without navigating complex wholesale markets." },
               { icon: <Briefcase size={24} />, title: "Independent Resellers", desc: "Build a home-based business distributing sacred goods to your local network." }
             ].map((item, i) => (
                <SacredFrame key={i} className="p-10 bg-[#1A0303]/80 border-[#C5A059]/20 text-center hover:bg-[#2D0505]/40 transition-colors">
                   <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#C5A059] border border-[#C5A059]/20">
                     {item.icon}
                   </div>
                   <h3 className="h1-sacred text-xl text-[#F5F0E1] mb-4">{item.title}</h3>
                   <p className="body-sacred text-sm text-[#E6D5B8]/60">{item.desc}</p>
                </SacredFrame>
             ))}
          </div>
       </section>

       {/* How It Works */}
       <section className="py-24 bg-[#1A0303]/40 border-y border-[#C5A059]/10 relative z-10">
           <div className="max-w-[1000px] mx-auto px-10">
              <h2 className="h1-sacred text-3xl text-center text-[#F5F0E1] mb-20 glow-gold-solid">How The Partner Model Works</h2>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: "01", title: "Join", desc: "Register as a verified affiliate partner. No upfront fees." },
                  { step: "02", title: "Source", desc: "Access our catalog of verified sacred products at member prices." },
                  { step: "03", title: "Distribute", desc: "Place orders for your community or retail needs." },
                  { step: "04", title: "Earn", desc: "Track your margins and earnings transparently on your dashboard." }
                ].map((s, i) => (
                  <div key={i} className="relative">
                    <div className="text-6xl h1-sacred text-[#C5A059]/10 absolute -top-8 left-0 select-none pointer-events-none">{s.step}</div>
                    <div className="relative z-10 pt-4">
                       <h4 className="label-sacred text-[#C5A059] text-[0.6rem] tracking-[0.2em] mb-2 font-bold uppercase">{s.title}</h4>
                       <p className="body-sacred text-sm text-[#E6D5B8]/60 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
       </section>

       {/* Community Value */}
       <section className="py-24 px-10 max-w-4xl mx-auto text-center relative z-10">
           <div className="mb-10 inline-block p-4 border border-[#C5A059]/20 rounded-full">
             <Users size={24} className="text-[#C5A059]" />
           </div>
           <h2 className="h1-sacred text-3xl text-[#F5F0E1] mb-6 glow-gold-solid">Why Community Matters</h2>
           <p className="body-sacred text-lg text-[#E6D5B8]/70 leading-relaxed mb-12">
             In a market often driven by obscure pricing and uncertain quality, we stand for consistency. 
             By joining Jaya Janardhana, you become part of a trusted ecosystem where sourcing is reliable, 
             earnings are clear, and the sanctity of the products is guaranteed. We grow when you grow.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-8">
              <button onClick={() => window.location.hash = '/register'} className="cta-gold px-12 py-5 text-[0.7rem]">Start as an Affiliate</button>
              <button onClick={() => window.location.hash = '/catalog'} className="cta-outline-gold px-12 py-5 text-[0.7rem] glow-gold-cta">Browse Collections</button>
           </div>
       </section>
    </div>
  )
}

export default AboutPage;
