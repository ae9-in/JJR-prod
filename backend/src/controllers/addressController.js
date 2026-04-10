import { asyncHandler } from '../middleware/asyncHandler.js';
import { Address } from '../models/Address.js';

const normalizeDefaultAddress = async (userId, addressId) => {
  await Address.updateMany(
    { user: userId, _id: { $ne: addressId } },
    { $set: { isDefault: false } }
  );
};

export const getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.json({ addresses });
});

export const createAddress = asyncHandler(async (req, res) => {
  const address = await Address.create({
    user: req.user._id,
    ...req.body
  });

  if (address.isDefault) {
    await normalizeDefaultAddress(req.user._id, address._id);
  }

  res.status(201).json({ address });
});
