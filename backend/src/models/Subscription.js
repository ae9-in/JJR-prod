import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  planId: { type: String, required: true },
  planName: { type: String, required: true },
  planPrice: { type: Number, required: true },
  billingMode: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
