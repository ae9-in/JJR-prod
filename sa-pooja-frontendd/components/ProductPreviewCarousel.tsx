import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { PRODUCTS, VERTICALS } from '../data/constants';
import SacredFrame from './SacredFrame';
import ProductImage from './ProductImage';

const ProductPreviewCarousel: React.FC = () => {
  // Show all approved products
  const previewProducts = PRODUCTS;

  const getVerticalName = (id: string) => {
    return VERTICALS.find(v => v.id === id)?.name || 'Sacred Artifact';
  };

  const handleRestrictedAccess = () => {
    // Redirect to register as per instructions
    window.location.hash = '/register';
  };

  return (
    <section className="py-24 border-y border-[#C5A059]/5 bg-[#1A0303]/30 relative z-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative px-6">

        {/* Section Header */}
        <div className="text-center mb-16 fade-in-ritual">
          <h2 className="h1-sacred text-3xl md:text-4xl mb-4 text-[#F5F0E1] glow-gold-solid">Curated Sourcing Preview</h2>
          <div className="sandalwood-divider w-16 mx-auto mb-6 opacity-40"></div>
          <p className="label-sacred text-[0.55rem] tracking-[0.3em] text-[#C5A059] uppercase opacity-80">
            Official Pooja Price List &bull; Member Pricing
          </p>
        </div>

        {/* Carousel / Grid */}
        <div className="flex overflow-x-auto pb-12 gap-8 snap-x snap-mandatory px-4 md:justify-center scrollbar-hide -mx-4 md:mx-0">
          {previewProducts.map((product) => (
            <div
              key={product.id}
              onClick={handleRestrictedAccess}
              className="flex-shrink-0 w-[260px] snap-center cursor-pointer group relative transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1"
            >
              <SacredFrame className="h-full bg-[#1A0303] border-[#C5A059]/20 group-hover:border-[#C5A059]/60 group-hover:shadow-[0_20px_40px_rgba(197,160,89,0.2)] transition-all duration-300 relative">
                {/* Image Area - Fixed Aspect Ratio */}
                <div className="aspect-[4/5] w-full overflow-hidden relative bg-[#2D0505] flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#1A0303]/20 z-10 group-hover:bg-[#1A0303]/0 transition-colors"></div>
                  <div className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center">
                    <ProductImage
                      imagePath={product.image_path}
                      slug={product.slug}
                      alt={product.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale-[30%] group-hover:grayscale-0"
                    />
                  </div>

                  {/* Restricted Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1A0303]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Lock size={20} className="text-[#C5A059]" />
                      <span className="label-sacred text-[0.5rem] tracking-[0.2em] text-[#F5F0E1] uppercase border border-[#C5A059]/30 px-4 py-2 bg-[#1A0303]/80">Login to Unlock</span>
                    </div>
                  </div>
                </div>

                {/* Content Area - Name, Quantity, No Price */}
                <div className="p-6 text-center relative z-10 bg-gradient-to-b from-[#1A0303] to-[#2D0505] min-h-[150px] flex flex-col items-center justify-center">
                  <h3 className="h1-sacred text-xl text-[#F5F0E1] mb-1 leading-tight group-hover:text-[#C5A059] transition-colors">
                    {product.name}
                  </h3>
                  <p className="label-sacred text-[0.55rem] text-[#E6D5B8]/60 mb-6 tracking-widest uppercase">
                    {product.description}
                  </p>

                  <div className="mt-auto border border-[#C5A059]/10 bg-[#C5A059]/5 px-3 py-1.5 rounded-sm">
                    <p className="label-sacred text-[0.4rem] text-[#C5A059] tracking-widest uppercase opacity-80">
                      Affiliate Pricing Only
                    </p>
                  </div>
                </div>
              </SacredFrame>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-4">
          <button
            onClick={() => window.location.hash = '/register'}
            className="cta-outline-gold px-10 py-4 text-[0.6rem] hover:bg-[#C5A059] hover:text-[#1A0303] transition-all flex items-center gap-3 mx-auto glow-gold-cta"
          >
            <Lock size={12} />
            Unlock Full Catalog Pricing
          </button>
          <p className="mt-6 label-sacred text-[0.5rem] text-[#E6D5B8]/30 tracking-widest">
            Daily Essentials • Guaranteed Margins
          </p>
        </div>

      </div>
    </section>
  );
};

export default ProductPreviewCarousel;
