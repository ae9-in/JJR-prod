
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import SacredFrame from './SacredFrame';
import FloralPattern from '../background/FloralPattern';

import ProductImage from './ProductImage';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const context = useAppContext();
  const { cart } = context.state;
  const [selectedVariant, setSelectedVariant] = useState<string>(product.image); // Keep tracking variant image for logic
  const [selectedVariantPath, setSelectedVariantPath] = useState<string | undefined>(product.image_path);
  const [selectedVariantSlug, setSelectedVariantSlug] = useState<string | undefined>(product.slug);

  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const marginValue = (product.price * (product.commissionRate / 100));
  const hasVariants = product.variants && product.variants.length > 0;

  const handleVariantChange = (variant: { image: string, image_path?: string, slug?: string }) => {
    setSelectedVariant(variant.image);
    setSelectedVariantPath(variant.image_path || variant.image);
    setSelectedVariantSlug(variant.slug);
  }

  return (
    <div className="fade-in-ritual transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 cursor-pointer">
      <SacredFrame className="p-0 bg-[#F5F0E1] border-[#C5A059]/30 overflow-hidden group shadow-2xl hover:shadow-[0_25px_50px_rgba(0,0,0,0.35)] relative transition-shadow duration-300">
        {/* Subtle Sandalwood pattern overlay on card */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <FloralPattern className="w-full h-full scale-150" />
        </div>

        <div className="relative aspect-[4/5] overflow-hidden bg-[#faf7f0] flex items-center justify-center border-b border-[#C5A059]/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <ProductImage
              product={product}
              imagePath={selectedVariantPath || product.image_path}
              slug={selectedVariantSlug || product.slug}
              alt={product.name}
              className="max-w-full max-h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out drop-shadow-sm"
            />
          </div>
          <div className="absolute top-3 left-3 bg-[#1A0303]/95 border border-[#C5A059]/30 px-3 py-1.5 backdrop-blur-md z-10">
            <span className="label-sacred text-[0.45rem] text-[#C5A059] font-bold">{product.commissionRate}% Profit Margin</span>
          </div>

          {quantity > 0 && (
            <div className="absolute top-3 right-3 bg-[#C5A059] text-[#1A0303] w-6 h-6 rounded-full flex items-center justify-center font-bold text-[0.6rem] shadow-lg animate-[fadeInRitual_0.3s_ease-out]">
              {quantity}
            </div>
          )}

          {hasVariants && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0303]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
              <div className="flex gap-2 flex-wrap justify-center">
                {product.variants?.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => handleVariantChange(variant)}
                    className={`label-sacred text-[0.4rem] px-2.5 py-1.5 rounded-full transition-all duration-200 font-medium ${selectedVariant === variant.image
                      ? 'bg-[#C5A059] text-[#1A0303] shadow-md'
                      : 'bg-[#C5A059]/40 text-[#E6D5B8] hover:bg-[#C5A059]/60'
                      }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4 relative z-10">
          <div>
            <h4 className="h1-sacred text-lg text-[#F5F0E1] font-bold tracking-normal mb-1">{product.name}</h4>
            <p className="label-sacred text-[0.5rem] text-[#8E6C27] tracking-widest uppercase opacity-80">{product.description}</p>
            {hasVariants && (
              <p className="label-sacred text-[0.4rem] text-[#8E6C27] mt-1 opacity-60">
                Selected: {product.variants?.find(v => v.image === selectedVariant)?.name || 'Classic'}
              </p>
            )}
            <div className="sandalwood-divider my-3 opacity-30"></div>
          </div>

          <div className="flex items-center justify-between items-end mb-4">
            <div className="flex flex-col">
              <span className="label-sacred text-[0.4rem] opacity-60 mb-1 text-[#E6D5B8] font-bold tracking-widest">Member Price</span>
              <span className="h1-sacred text-3xl text-[#F5F0E1] font-bold tracking-tight">₹{product.price.toLocaleString()}</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="label-sacred text-[0.4rem] opacity-70 mb-1 text-[#8E6C27] font-bold tracking-widest">Your Earnings</span>
              <div className="bg-[#C5A059]/10 px-2 py-1 border border-[#C5A059]/30 rounded-sm">
                <span className="h1-sacred text-sm text-[#8E6C27] font-bold shrink-0">+ ₹{marginValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quantity Control Bar */}
          <div className="flex items-center justify-between bg-[#C5A059]/5 rounded-sm border border-[#C5A059]/20 p-1 mt-6">
            <button
              onClick={() => context.decreaseQuantity(product.id)}
              disabled={quantity === 0}
              className={`p-3 transition-colors rounded-sm ${quantity === 0 ? 'text-gray-400 cursor-not-allowed opacity-30' : 'text-[#8E6C27] hover:bg-[#C5A059]/10 hover:text-[#F5F0E1]'}`}
            >
              <Minus size={16} />
            </button>

            <span className={`h1-sacred text-xl w-12 text-center font-bold transition-colors ${quantity > 0 ? 'text-[#F5F0E1]' : 'text-[#F5F0E1]/40'}`}>
              {quantity}
            </span>

            <button
              onClick={() => context.addToCart(product)}
              className="p-3 text-[#F5F0E1] bg-[#C5A059]/20 hover:bg-[#C5A059] hover:text-[#1A0303] transition-all rounded-sm shadow-sm"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </SacredFrame>
    </div>
  );
};

export default ProductCard;
