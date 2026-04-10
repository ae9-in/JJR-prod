
import { Vertical, Product } from '../types';

export const VERTICALS: Vertical[] = [
  { id: 'v1', name: 'Incense & Resins', icon: 'Wind', description: 'Standard wholesale packs for retail resale.', color: 'bg-[#632424]' },
  { id: 'v3', name: 'Daily Pooja', icon: 'Flame', description: 'Inventory for daily temple and home ritual needs.', color: 'bg-[#8B4513]' },
];

export const PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    verticalId: 'v3', 
    name: '100% Pure Camphor', 
    description: 'Sacred Ritual Grade - 100g', 
    price: 219, 
    image: 'Camphor JJ.png', 
    image_path: 'Camphor JJ.png',
    slug: 'pure-camphor',
    commissionRate: 15 
  },
  { 
    id: 'p2', 
    verticalId: 'v3', 
    name: 'Sacred Deepa Oil', 
    description: 'Traditional Heritage Blend - 800 mL', 
    price: 209, 
    image: 'Pooja Oil JJ.png', 
    image_path: 'Pooja Oil JJ.png',
    slug: 'pooja-oil',
    commissionRate: 12 
  },
  { 
    id: 'p3', 
    verticalId: 'v1', 
    name: 'Sandalwood Bliss Agarbatti', 
    description: 'Heritage Collection - Premium Pack 100g', 
    price: 59, 
    image: 'Agarbhatti Sandalwood JJ.png', 
    image_path: 'Agarbhatti Sandalwood JJ.png',
    slug: 'agarbatti-sandalwood',
    commissionRate: 20,
    variants: [
      { name: 'Classic', image: 'Agarbhatti.png', image_path: 'Agarbhatti.png', slug: 'agarbatti' },
      { name: 'Sandalwood', image: 'Agarbhatti Sandalwood JJ.png', image_path: 'Agarbhatti Sandalwood JJ.png', slug: 'agarbatti-sandalwood' },
      { name: 'Rose', image: 'Agarbhatti Rose JJ.png', image_path: 'Agarbhatti Rose JJ.png', slug: 'agarbatti-rose' },
      { name: '3-in-1', image: 'Agarbhatti JJ 3in1.png', image_path: 'Agarbhatti JJ 3in1.png', slug: 'agarbatti-3in1' }
    ]
  },
  { 
    id: 'p4', 
    verticalId: 'v1', 
    name: 'Sandalwood Dhoop', 
    description: '40 Ritual Sticks - Pure Sandalwood (100g)', 
    price: 59, 
    image: 'Sandalwood JJ.png', 
    image_path: 'Sandalwood JJ.png',
    slug: 'sandalwood-dhoop',
    commissionRate: 20 
  },
  { 
    id: 'p5', 
    verticalId: 'v3', 
    name: 'Arsina + Kunkuma', 
    description: 'Sacred Turmeric & Saffron Powder - 10g+10g', 
    price: 20, 
    image: 'ArsinaKunkuma.png', 
    image_path: 'ArsinaKunkuma.png',
    slug: 'arsina-kunkuma',
    commissionRate: 15 
  },
  { 
    id: 'p6', 
    verticalId: 'v3', 
    name: 'Premium Cotton Wicks', 
    description: '100% Pure Cotton - 40 Piece Pack', 
    price: 10, 
    image: 'Cotton Wicks JJ.png', 
    image_path: 'Cotton Wicks JJ.png',
    slug: 'cotton-wicks',
    commissionRate: 10 
  }
];
