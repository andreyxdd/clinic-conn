import { CookieOptions } from 'express';

require('dotenv').config();

export const corsOptions = {
  allowedHeaders: [
    'Origin', 'X-Requested-With', 'Content-Type',
    'Accept', 'X-Access-Token', 'Authorization',
  ],
  credentials: true, // this allows to send cookies back (to client)
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: process.env.CLIENT_SIDE_URL,
  preflightContinue: false,
};

export const corsSocketOptions = {
  origin: process.env.CLIENT_SIDE_URL,
  credentials: true,
  methods: ['GET', 'POST'],

};

export const isProduction = process.env.NODE_ENV === 'production';

export const cookiesOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'strict' : 'lax'),
  domain: process.env.BASE_DOMAIN,
  path: '/',
};

export const timeToUpdateRefreshToken = 4 * 24 * 60 * 60; // five days
