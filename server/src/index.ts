import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';
import coockieParser from 'cookie-parser';
import cors from 'cors';
import User from './entity/User';
import UserResolver from './resolvers';
import { createAccessToken, createRefreshToken, sendRefreshToken } from './auth';

require('dotenv').config();

const corsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
  credentials: true, // this allows to send back (to client) cookies
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: 'http://localhost:3000',
  preflightContinue: false,
};

(async () => {
  const PORT = process.env.PORT || 4000;
  const app = express();
  app.use(coockieParser());
  app.use(cors(corsOptions));

  // -- non graphql endpoints
  app.get('/', (_, res) => {
    res.send('Starter endpoint');
  });

  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.jid;

    if (!token) {
      return res.send({ ok: false, accessToken: '' });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (e) {
      console.log(e);
      return res.send({ ok: false, accessToken: '' });
    }

    // token is valid, and the access token can be send back
    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });
  //--

  // -- db
  await createConnection();
  // --

  // -- apollo server settings
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  // --

  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
})();
