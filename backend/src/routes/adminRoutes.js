import { Router } from 'express';
import { CartOrder } from '../models/CartOrder.js';
import { Subscription } from '../models/Subscription.js';

const router = Router();

// 1. Checkout Cart
router.post('/checkout', async (req, res) => {
  try {
    const { name, email, phone, address, items, totalAmount } = req.body;

    if (!name || !email || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'All fields and cart items are required' });
    }

    const order = await CartOrder.create({
      name,
      email,
      phone,
      address,
      items,
      totalAmount: Number(totalAmount),
      status: 'pending'
    });

    console.log(`[Express] Cart Order created: ${order._id}`);
    res.status(201).json({ success: true, orderId: order._id });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Checkout failed' });
  }
});

// 2. Subscription Register
router.post('/subscribe', async (req, res) => {
  try {
    const { name, email, phone, address, planId, planName, planPrice, billingMode } = req.body;

    if (!name || !email || !phone || !address || !planId || !planName || !planPrice || !billingMode) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const registration = await Subscription.create({
      name,
      email,
      phone,
      address,
      planId,
      planName,
      planPrice: Number(planPrice),
      billingMode,
      status: 'pending'
    });

    console.log(`[Express] Subscription created: ${registration._id}`);
    res.status(201).json({ success: true, registrationId: registration._id });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Subscription failed' });
  }
});

// 3. Admin Data Retrieval
router.get('/data', async (req, res) => {
  try {
    const orders = await CartOrder.find({}).sort({ createdAt: -1 });
    const subscriptions = await Subscription.find({}).sort({ createdAt: -1 });

    res.json({ success: true, orders, subscriptions });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch admin data' });
  }
});

// 4. Admin Actions (Delete/Update Status)
router.post('/action', async (req, res) => {
  try {
    const { action, type, id, status } = req.body;

    if (!action || !type || !id) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const Model = type === 'order' ? CartOrder : Subscription;

    if (action === 'delete') {
      await Model.findByIdAndDelete(id);
      return res.json({ success: true, message: `${type} deleted successfully` });
    }

    if (action === 'update_status') {
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      await Model.findByIdAndUpdate(id, { status });
      return res.json({ success: true, message: `${type} status updated` });
    }

    res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to execute action' });
  }
});

export default router;
