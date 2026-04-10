import { Product } from '../models/Product.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const FALLBACK_PRODUCTS = [];

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    
    // Add realistic 15-20% margin to mock products if not present
    const enrichedProducts = products.map(p => {
      const pObj = p.toObject();
      if (!pObj.commissionRate) {
        pObj.commissionRate = Math.floor(pObj.price * 0.15); // 15% default margin
      }
      return pObj;
    });

    res.json({ products: enrichedProducts });
  } catch (error) {
    console.warn('MongoDB query failed, falling back to static products:', error.message);
    
    // Static fallback for complete reliability
    res.json({
      products: FALLBACK_PRODUCTS
    });
  }
});

// @desc    Upload new product (Affiliate)
// @route   POST /api/products
// @access  Public
export const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, image, affiliateId, verticalId } = req.body;
    
    const product = await Product.create({
      name,
      slug: name.toLowerCase().replace(/ \s+/g, '-'),
      description,
      price: Number(price),
      image: image || '/assets/products/Camphor JJ.png',
      verticalId: verticalId || 'DEFAULT',
      commissionRate: Math.floor(Number(price) * 0.15),
      affiliateId
    });

    res.status(201).json(product);
  } catch (error) {
    // Fallback to memory
    const mockProduct = { _id: Date.now().toString(), ...req.body };
    FALLBACK_PRODUCTS.push(mockProduct);
    res.status(201).json(mockProduct);
  }
});
