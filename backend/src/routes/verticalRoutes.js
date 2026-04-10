import { Router } from 'express';
import { getVerticals } from '../controllers/verticalController.js';

const router = Router();

router.get('/', getVerticals);

export default router;
