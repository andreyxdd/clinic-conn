import { Router } from 'express';
import { authMiddleware } from '../utils/auth';
import {
  login, logout, register, resendConfirmationLink,
  refreshTokens, checkEmail, checkUsername, confirmEmail,
} from '../controllers/authControllers';

const router = Router();

//--
router.post('/login', login);
router.post('/register', register);
router.get('/reconfirm', resendConfirmationLink);
router.get('/refresh_tokens', refreshTokens);
router.get('/check_email', checkEmail);
router.get('/check_email', checkEmail);
router.get('/check_username', checkUsername);
router.get('/confirmation/:token', confirmEmail);

// -- below routes only for authorized users
router.use(authMiddleware);
router.post('/logout', logout);

export default router;
