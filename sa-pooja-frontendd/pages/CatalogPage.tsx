import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { PRODUCTS, VERTICALS } from '../data/constants';
import ProductCard from '../components/ProductCard';

const CatalogPage: React.FC = () => {
  const context = useAppContext();
  const filtered = useMemo(
    () =>
      context.state.activeVerticalId
        ? PRODUCTS.filter((product) => product.verticalId === context.state.activeVerticalId)
        : PRODUCTS,
    [context.state.activeVerticalId]
  );

  return (
    <div className="max-w-[1400px] mx-auto px-10 py-32 relative z-10 fade-in-ritual">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
        <div>
          <h2 className="h1-sacred text-4xl md:text-5xl metallic-gold-text font-bold mb-4 glow-gold-metallic">
            The Collection.
          </h2>
          <div className="sandalwood-divider w-40 mb-4 opacity-40"></div>
          <p className="label-sacred text-[0.6rem] opacity-40 text-[#E6D5B8] tracking-[0.4em] uppercase">
            Open Product Catalog
          </p>
        </div>

        <div className="flex flex-wrap gap-3 bg-[#1A0303]/80 p-2 border border-[#C5A059]/15 rounded-sm shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => context.setActiveVertical(null)}
            className={`label-sacred text-[0.55rem] px-8 py-3 transition-all rounded-sm ${!context.state.activeVerticalId ? 'bg-gradient-to-br from-[#8e6c27] to-[#cf9e42] text-[#1A0303] font-black' : 'opacity-40 hover:opacity-100 hover:text-[#C5A059]'}`}
          >
            All Items
          </button>
          {VERTICALS.map((vertical) => (
            <button
              key={vertical.id}
              onClick={() => context.setActiveVertical(vertical.id)}
              className={`label-sacred text-[0.55rem] px-8 py-3 transition-all rounded-sm ${context.state.activeVerticalId === vertical.id ? 'bg-gradient-to-br from-[#8e6c27] to-[#cf9e42] text-[#1A0303] font-black' : 'opacity-40 hover:opacity-100 hover:text-[#C5A059]'}`}
            >
              {vertical.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
