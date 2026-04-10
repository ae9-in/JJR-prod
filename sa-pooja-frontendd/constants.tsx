
import { Vertical, Product } from './types';

export const VERTICALS: Vertical[] = [
  { id: 'v1', name: 'Incense & Resins', icon: 'Wind', description: 'Standard wholesale packs for retail resale.', color: 'bg-[#632424]' },
  { id: 'v2', name: 'Metalware', icon: 'Sun', description: 'High-quality cast brass and copper vessels.', color: 'bg-[#D4AF37]' },
  { id: 'v3', name: 'Consumables', icon: 'Flame', description: 'Inventory for daily temple and home ritual needs.', color: 'bg-[#8B4513]' },
  { id: 'v4', name: 'Artifacts', icon: 'Gem', description: 'Artisanal statues with reliable margin potential.', color: 'bg-[#3D1414]' },
  { id: 'v5', name: 'Sacred Oils', icon: 'Flower2', description: 'Bottled and bulk lighting oils for resellers.', color: 'bg-[#556B2F]' },
  { id: 'v6', name: 'Curation Kits', icon: 'Moon', description: 'Bundled inventory optimized for distribution.', color: 'bg-[#B22222]' },
];

export const PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    verticalId: 'v2', 
    name: 'Gajalakshmi Brass Lamp', 
    description: 'Cast brass lamp, 1.2kg. Standardized quality for retail distribution.', 
    price: 1250, 
    image: 'https://images.unsplash.com/photo-1603903173750-754673966579?auto=format&fit=crop&q=80&w=1000', 
    commissionRate: 15 
  },
  { 
    id: 'p2', 
    verticalId: 'v4', 
    name: 'Panchaloha Ganesha Idol', 
    description: 'Traditional five-metal alloy. Standard height for consistent resell pricing.', 
    price: 4500, 
    image: 'https://images.unsplash.com/photo-1567591974574-e8626308e280?auto=format&fit=crop&q=80&w=1000', 
    commissionRate: 12 
  },
  { 
    id: 'p3', 
    verticalId: 'v1', 
    name: 'Sandalwood Sambrani Cups', 
    description: 'Wholesale box of 12 packs. High-retention fragrance resin.', 
    price: 350, 
    image: 'https://images.unsplash.com/photo-1602847213180-50e43a80dfdf?auto=format&fit=crop&q=80&w=1000', 
    commissionRate: 25 
  },
  { 
    id: 'p4', 
    verticalId: 'v6', 
    name: 'Standard Ritual Bundle', 
    description: 'Distribution kit: lighting oil, wicks, and hand-rolled incense.', 
    price: 2899, 
    image: 'https://images.unsplash.com/photo-1542397284385-6014195c5197?auto=format&fit=crop&q=80&w=1000', 
    commissionRate: 20 
  },
  { 
    id: 'p5', 
    verticalId: 'v3', 
    name: 'Havan Wood Logs', 
    description: '500g wholesale bundle. Sourced for ritual fuel requirements.', 
    price: 1280, 
    image: 'https://images.unsplash.com/photo-1520038410233-7141f77e47aa?auto=format&fit=crop&q=80&w=1000', 
    commissionRate: 18 
  },
  { 
    id: 'p6', 
    verticalId: 'v5', 
    name: 'Mahua Lighting Oil (500ml)', 
    description: 'Filtered low-soot mahua oil. Optimized for partner distribution.', 
    price: 420, 
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1000', 
    commissionRate: 30 
  },
  { 
    id: 'p7', 
    verticalId: 'v2', 
    name: 'Pure Copper Vessel', 
    description: 'Heavy gauge copper vessel. Hammered finish, high durability.', 
    price: 1650, 
    image: 'https://images.unsplash.com/photo-1634818462211-ee45fa01f49c?auto=format&fit=crop&q=80&w=1000', 
    commissionRate: 15 
  },
  { 
    id: 'p8', 
    verticalId: 'v4', 
    name: 'Marble Statuette', 
    description: 'Premium white marble. Standardized sizing for retail inventory.', 
    price: 17200, 
    image: 'https://images.unsplash.com/photo-1590050752117-23a9d7fc21ad?auto=format&fit=crop&q=80&w=1000', 
    commissionRate: 10 
  },
];
