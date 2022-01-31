import { sign, verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { Response } from 'express';
import { getConnection } from 'typeorm';
import User from './entity/User';
import { AuthContext } from './types';

export const createAccessToken = (user: User) => sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '10m' });

export const createRefreshToken = (user: User) => sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });

// expectiong user to send a header with authrization field
export const isAuth: MiddlewareFn<AuthContext> = ({ context }, next) => {
  const { authorization } = context.req.headers;

  if (!authorization) { throw new Error('Access disallowed: not authenticated'); }

  try {
    const token = authorization?.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (e) {
    console.log(e);
    throw new Error('Access disallowed: not authenticated');
  }

  return next();
};

export const sendRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie('jid', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/refresh_token',
  });
};

export const revokeRefreshTokensForUser = async (user: User) => {
  try {
    await getConnection().getRepository(User).increment({ id: user.id }, 'tokenVersion', 1);
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
};
