import { Router } from 'express';
import { createChat, getUserChats } from '../controllers/chatControllers';
import { authMiddleware } from '../utils/auth';

const router = Router();

router.use(authMiddleware);

router.post('/create', createChat);
router.get('/get_user_chats', getUserChats);

export default router;
