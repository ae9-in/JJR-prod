import { Router } from 'express';
import { generatePanchanga } from '../controllers/panchangaController.js';

const router = Router();

router.post('/', generatePanchanga);

export default router;
