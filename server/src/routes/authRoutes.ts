import { Router } from 'express';
import { authMiddleware } from '../utils/authUtils';
import {
  login, logout, register, refreshTokens,
  revokeRefreshToken, checkEmail, checkUsername,
} from '../controllers/authControllers';

const router = Router();

//--
router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.get('/refresh_tokens', refreshTokens);
router.get('/check_email', checkEmail);
router.get('/check_email', checkEmail);
router.get('/check_username', checkUsername);

// -- below routes only for authorized users
router.use(authMiddleware);
router.get('/revoke_refresh_token', revokeRefreshToken);

export default router;
