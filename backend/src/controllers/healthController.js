import mongoose from 'mongoose';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getHealth = asyncHandler(async (req, res) => {
  res.json({
    status: 'ok',
    service: 'sa-pooja-backend',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});
