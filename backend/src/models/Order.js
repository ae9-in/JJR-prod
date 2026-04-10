import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    commissionRate: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const deliveryAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ['COD', 'UPI', 'CARD', 'NETBANKING', 'RAZORPAY'],
      default: 'COD'
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING'
    },
    transactionId: {
      type: String,
      trim: true
    },
    paidAt: {
      type: Date
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderCode: {
      type: String,
      required: true,
      unique: true
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(items) => items.length > 0, 'At least one order item is required']
    },
    deliveryAddress: {
      type: deliveryAddressSchema,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    totalEarnings: {
      type: Number,
      required: true,
      min: 0
    },
    payment: {
      type: paymentSchema,
      default: () => ({})
    },
    status: {
      type: String,
      enum: ['PLACED', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PLACED'
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);
