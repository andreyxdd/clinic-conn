import { sign, verify } from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { getConnection } from 'typeorm';
import User from '../entities/User';
import { cookiesOptions } from '../config';
import logger from './logUtils';

export const createAccessToken = (user: User) => sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '12m' });

export const createRefreshToken = (user: User) => sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });

export const createConfirmationToken = (userId: string) => sign({ userId }, process.env.EMAIL_TOKEN_SECRET!, { expiresIn: '1d' });

export const attachRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie('jid', refreshToken, {
    ...cookiesOptions,
    maxAge: refreshToken ? 7 * 24 * 60 * 60 * 1000 : 0,
  });
};

export const revokeRefreshTokensForUser = async (user: User) => {
  try {
    await getConnection().getRepository(User).increment({ id: user.id }, 'tokenVersion', 1);
  } catch (e) {
    logger.error(e);
    return false;
  }
  return true;
};

// expectiong user to send a header with authrization field
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  logger.info(authorization);

  if (!authorization) {
    res.status(401);
    return next(new Error('Access disallowed: not authenticated'));
  }

  const token = authorization?.split(' ')[1];
  if (!token) {
    res.status(401);
    return next(new Error('Access disallowed: not authenticated'));
  }

  try {
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    res.locals.payload = payload;
    return next();
  } catch (e) {
    res.status(401);
    return next(new Error('Access disallowed: not authenticated'));
  }
};
