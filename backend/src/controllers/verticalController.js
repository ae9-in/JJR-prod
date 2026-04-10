import { asyncHandler } from '../middleware/asyncHandler.js';
import { Vertical } from '../models/Vertical.js';

export const getVerticals = asyncHandler(async (req, res) => {
  const verticals = await Vertical.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
  res.json({ verticals });
});
