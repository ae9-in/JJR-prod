import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    slug: { type: String, trim: true }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    verticalId: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    commissionRate: {
      type: Number,
      required: true,
      min: 0
    },
    variants: [variantSchema],
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ verticalId: 1, isActive: 1 });
productSchema.index({ name: 1 });

export const Product = mongoose.model('Product', productSchema);
