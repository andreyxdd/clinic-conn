import { Router } from 'express';
import { getUser } from '../controllers/userControllers';
import { authMiddleware } from '../utils/auth';

const router = Router();

router.use(authMiddleware);

router.get('/get', getUser);

export default router;
