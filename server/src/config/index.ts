import { CookieOptions } from 'express';

export const corsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
  credentials: true, // this allows to send back (to client) cookies
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: 'http://localhost:3000',
  preflightContinue: false,
};

export const isProduction = process.env.NODE_ENV === 'production';

export const cookiesOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'strict' : 'lax'),
  domain: process.env.BASE_DOMAIN,
  path: '/refresh_token',
};

export const timeToUpdateRefreshToken = 4 * 24 * 60 * 60; // five days
