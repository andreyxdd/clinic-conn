import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { compare } from 'bcryptjs';
import { verify } from 'jsonwebtoken';
import coockieParser from 'cookie-parser';
import cors from 'cors';
import User from './entities/User';
import {
  createAccessToken, createRefreshToken,
  attachRefreshToken, authMiddleware, revokeRefreshTokensForUser,
} from './auth';
import { corsOptions, timeToUpdateRefreshToken } from './config/index';

require('dotenv').config();

(async () => {
  const PORT = process.env.PORT || 4000;
  const app = express();
  app.use(coockieParser());
  app.use(cors(corsOptions));

  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  app.use(express.json());

  // -- endpoints
  app.get('/', (_, res) => {
    res.send('For starters');
  });

  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        res.status(404).send({
          message: 'User with provided email not found',
        });
      }

      const valid = await compare(password as string, user!.password);

      if (!valid) {
        res.status(401).send({
          message: 'Inalid password provided',
        });
      }

      attachRefreshToken(res, createRefreshToken(user!));

      res.status(200).send(
        {
          accessToken: createAccessToken(user!),
          user,
        },
      );
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  });

  app.post('/refresh_access_token', async (req, res) => {
    try {
      const refreshToken = req.cookies.jid;

      if (!refreshToken) {
        res.send({ ok: false, accessToken: '' });
      }

      let refreshPayload: any = null;

      refreshPayload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

      // refresh token is valid
      const user = await User.findOne({ id: refreshPayload.userId });

      if (!user) {
        res.status(404).send({
          message: 'User not found',
        });
      }

      if (user?.tokenVersion !== refreshPayload.tokenVersion) {
        res.status(404).send({
          message: 'Refresh token version do not coincide',
        });
      }

      const expiration = new Date(refreshPayload.exp * 1000);
      const now = new Date();
      const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000;

      if (secondsUntilExpiration < timeToUpdateRefreshToken) {
        attachRefreshToken(res, createRefreshToken(user!));
      }

      res.status(200).send(
        {
          accessToken: createAccessToken(user!),
          user,
        },
      );
    } catch (e) {
      attachRefreshToken(res, '');
      res.status(500).send({ message: e.message });
    }
  });

  app.post('/logout', authMiddleware, async (_, res) => {
    attachRefreshToken(res, '');
    res.status(200);
  });

  app.post('/revoke_refresh_token', authMiddleware, async (_, res) => {
    const id = res.locals.payload.userId;
    const user = await User.findOne({ where: { id } });

    if (!user) {
      res.status(404).send({
        message: 'User with given Id not found',
      });
    }

    const revokedStatus = await revokeRefreshTokensForUser(user!);

    res.status(revokedStatus ? 200 : 500);
  });

  app.get('/user', authMiddleware, async (_, res) => {
    const id = res.locals.payload.userId;
    const user = await User.findOne(
      { where: { id }, select: ['username', 'email', 'id'] },
    );

    if (!user) {
      res.status(404).send({
        message: 'User with given Id not found',
      });
    }

    res.json(user);
  });

  app.get('/users', authMiddleware, async (_, res) => {
    const users = await User.find({ select: ['username', 'email', 'id'] });
    res.send(users);
  });
  //--

  // -- db
  await createConnection();
  // --

  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
})();
