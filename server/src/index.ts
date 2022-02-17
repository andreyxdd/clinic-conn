/* eslint-disable import/no-named-default */
import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createConnection } from 'typeorm';
import coockieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
// import xss from 'xss-clean';
import hpp from 'hpp';
import { rateLimit } from 'express-rate-limit';
import compression from 'compression';
import { version as v } from '../package.json';
import logger from './utils/logUtils';

// Routing
import { default as authRouter } from './routes/authRoutes';
import { default as userRouter } from './routes/userRoutes';
import { default as chatRouter } from './routes/chatRoutes';
import { corsOptions } from './config/index';
import User from './entities/User';
import Message from './entities/Message';

// Sockets
// import videoSocket from './sockets/videoSocket';
import chatSocket from './sockets/chatSocket';

require('dotenv').config();

(async () => {
  const PORT = process.env.PORT || 4000;
  const app = express();

  // needed later for socket.io:
  const httpServer = createServer(app);

  // initiate socket connection
  /*
  const ioVideo = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_SIDE_URL!,
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });
  */

  const ioChat = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_SIDE_URL!,
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // -- Global Middlewares:
  // Enable CORS (Access-Control-Allow-Origin: only from the client!)
  app.use(cors(corsOptions));

  // trust proxies (is it needed?)
  // app.enable('trust proxy');

  // body/cookies parser
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({
    extended: true,
    limit: '10kb',
  }));
  app.use(coockieParser());

  // Security Headers
  app.use(helmet());

  // Sanitize inputs (XSS)
  // TODO: find TS alternative
  // app.use(xss());

  // Preventing parameter tampering
  app.use(hpp());

  // Rate Limiter
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 100,
    message: 'Too many requests! Please try again in an hour!',
  });

  // TODO: consider using development Logs
  if (process.env.NODE_ENV === 'development') {
    // app.use(morgan('dev'));
  }

  // Compress the responses
  app.use(compression());

  // --

  // -- endpoints
  app.get('/', (_, res) => {
    res.send(`API version ${v}`);
  });

  // endpoints for the tests
  app.get('/users', async (_, res) => {
    const users = await User.find({ select: ['username', 'email', 'id'] });
    res.send(users);
  });

  app.post('/postMessage', async (req, res) => {
    const { chatId, userId, text } = req.body;
    logger.info(req.body);
    if (chatId && userId && text) {
      const date = new Date();
      await Message.insert({
        chatId: Number(chatId),
        userId: Number(userId),
        text: text as string,
        sentAt: date,
      });
    }
    res.send();
  });
  //--

  // -- Routing
  app.use('/api', limiter);
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/chat', chatRouter);

  // -- db
  await createConnection();
  // --

  // -- listening
  httpServer.listen(PORT, () => {
    logger.info(`Server running on port: ${PORT}`);

    chatSocket({ io: ioChat });
    // videoSocket({ io: ioVideo });
  });
  //--
})();
