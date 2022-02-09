import { Router } from 'express';
import { getUser } from '../controllers/userControllers';
import { authMiddleware } from '../utils/authUtils';

const router = Router();

router.use(authMiddleware);

router.get('/get', getUser);

export default router;
