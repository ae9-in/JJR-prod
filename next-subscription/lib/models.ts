
import mongoose from 'mongoose';

// 1. SUBSCRIBER MODEL
const SubscriberSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  planId: { type: String, required: true },
  planName: { type: String, required: true },
  planPrice: { type: Number, required: true }, // in paise
  status: { 
    type: String, 
    enum: ['active', 'paused', 'cancelled', 'pending'], 
    default: 'pending' 
  },
  razorpayPaymentId: { type: String },
  billingCycleStart: { type: Date },
  nextBillingDate: { type: Date },
}, { timestamps: true });

// 2. ORDER MODEL
const OrderSchema = new mongoose.Schema({
  subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber', required: true },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String },
  amount: { type: Number, required: true }, // total in paise
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  gstAmount: { type: Number, required: true }, // in paise
  invoiceNumber: { type: String, required: true, unique: true },
}, { timestamps: true });

// 3. SUBSCRIPTION LOG MODEL
const LogSchema = new mongoose.Schema({
  subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber', required: true },
  action: { 
    type: String, 
    enum: ['subscribed', 'paused', 'resumed', 'cancelled', 'renewed'], 
    required: true 
  },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const SubscriptionLog = mongoose.models.Log || mongoose.model('Log', LogSchema);
