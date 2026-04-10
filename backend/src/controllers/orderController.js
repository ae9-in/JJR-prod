import mongoose from 'mongoose';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

const generateOrderCode = () =>
  `JJ-SRC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress, payment } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Order items are required');
  }

  if (!deliveryAddress) {
    res.status(400);
    throw new Error('deliveryAddress is required');
  }

  const normalizedIds = items
    .map((item) => item.productId)
    .filter(Boolean)
    .map((id) => new mongoose.Types.ObjectId(id));

  const products = await Product.find({ _id: { $in: normalizedIds }, isActive: true });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      res.status(400);
      throw new Error(`Invalid product: ${item.productId}`);
    }

    const quantity = Number(item.quantity || 1);
    if (quantity < 1) {
      res.status(400);
      throw new Error('quantity must be at least 1');
    }

    return {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      commissionRate: product.commissionRate,
      image: product.image
    };
  });

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalEarnings = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity * (item.commissionRate / 100),
    0
  );

  const order = await Order.create({
    user: req.user._id,
    orderCode: generateOrderCode(),
    items: orderItems,
    deliveryAddress,
    totalAmount,
    totalEarnings,
    payment: {
      method: payment?.method || 'COD',
      status: payment?.status || 'PENDING',
      transactionId: payment?.transactionId
    },
    status: 'PLACED'
  });

  res.status(201).json({ order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});
