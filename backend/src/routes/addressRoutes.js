import { Router } from 'express';
import { createAddress, getMyAddresses } from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.route('/').get(getMyAddresses).post(createAddress);

export default router;
