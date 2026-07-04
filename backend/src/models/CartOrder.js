import mongoose from 'mongoose';

const cartOrderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  img: { type: String }
}, { _id: false });

const cartOrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: [cartOrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

export const CartOrder = mongoose.model('CartOrder', cartOrderSchema);
