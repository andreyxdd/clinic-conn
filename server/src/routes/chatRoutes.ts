import { Router } from 'express';
import { createChat } from '../controllers/chatControllers';
import { authMiddleware } from '../utils/authUtils';

const router = Router();

router.use(authMiddleware);

router.post('/create', createChat);

export default router;
