import { Router } from 'express';
import { getMe, getUser } from '../controllers/userControllers';
import { authMiddleware } from '../utils/auth';

const router = Router();

router.use(authMiddleware);
router.get('/me', getMe);
router.get('/get', getUser);

export default router;
