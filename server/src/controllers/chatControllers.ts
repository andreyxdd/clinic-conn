import 'reflect-metadata';
import { Request, Response } from 'express';
import { getManager } from 'typeorm';

import User from '../entities/User';
import Chat from '../entities/Chat';
import Message from '../entities/Message';
import UserChat from '../entities/UserChat';
import logger from '../utils/log';

// eslint-disable-next-line no-unused-vars
export const dummy = async (_req: Request, _res: Response) => { };

export const createChat = async (req: Request, res: Response) => {
  try {
    // -- finding users
    const initiatorId = res.locals.payload.userId; // from auth-middleware

    const { target: username } = req.body;
    const targetUser = await User.findOne(
      { where: { username } },
    );

    if (!targetUser) {
      return res.status(404).send({
        message: 'Target user not found',
      });
    }
    // --

    // -- Determining which chat id belongs to the given pair
    // of initiator and target
    const userChatsOfInitiator = await UserChat.find({
      where: { userId: initiatorId },
      select: ['chatId'],
    });
    const chatIdsOfInitiator = userChatsOfInitiator.map((uc: UserChat) => uc.chatId);

    const userChatsOfTarget = await UserChat.find({
      where: { userId: 17 },
      select: ['chatId'],
    });
    const chatIdsOfTarget = userChatsOfTarget.map((uc: UserChat) => uc.chatId);

    const commonChatId = chatIdsOfInitiator.filter((value) => chatIdsOfTarget.indexOf(value) > -1);

    if (commonChatId.length > 1) {
      throw new Error('More than one shared chat!');
    }

    if (commonChatId) {
      return res.status(200).send({ chatId: commonChatId[0] });
    }
    // --

    // -- creating a chat instance otherwise
    const newChat = await Chat.create().save();
    // --

    // -- creating joint table instances
    await UserChat.create({
      userId: initiatorId, chatId: newChat.id,
    }).save();

    await UserChat.create({
      userId: targetUser.id, chatId: newChat.id,
    }).save();

    return res.status(200).send({ chatId: newChat.id });
  } catch (e) {
    logger.error(e);
    return res.status(500).send({ message: e.message });
  }
};

export const getUserChats = async (_req: Request, res: Response) => {
  try {
    const { userId, username } = res.locals.payload; // from auth-middleware
    const userChats = await UserChat.find({
      where: { userId },
      select: ['chatId'],
    });

    if (!userChats) {
      // user doesn't have any chats
      return res.status(200).send([]);
    }

    const userChatsWithMessages = await Promise.all(
      userChats.map(async (uc: UserChat) => {
        const { chatId } = uc;

        const queryResult: Array<{ username: string }> = await getManager().query(
          `
          SELECT
            "User"."username"
          FROM "UserChat"
          LEFT JOIN "User" ON "User"."id"="UserChat"."userId"
          WHERE "UserChat"."userId" != $1 AND "UserChat"."chatId" = $2
          LIMIT 1;
          `,
          [userId, chatId],
        );
        const participantUsername = queryResult[0].username;

        const dbmessages = await Message.find({
          where: { chatId },
          select: ['userId', 'text', 'sentAt', 'id'],
        });

        const messages = dbmessages.map(
          (msg) => ({
            username: msg.userId !== userId ? participantUsername : username,
            text: msg.text,
            sentAt: msg.sentAt,
            id: msg.id,
          }),
        );

        return { chatId, messages, participantUsername };
      }),
    );

    return res.status(200).send(userChatsWithMessages);
  } catch (e) {
    logger.error(e);
    return res.status(500).send({ message: e.message });
  }
};

export const getUserChatsViaSockets = async (userId: number, username: string) => {
  try {
    const userChats = await UserChat.find({
      where: { userId },
      select: ['chatId'],
    });

    if (!userChats) {
      // user doesn't have any chats
      return [];
    }

    const userChatsWithMessages = await Promise.all(
      userChats.map(async (uc: UserChat) => {
        const { chatId } = uc;

        const queryResult: Array<{ username: string }> = await getManager().query(
          `
          SELECT
            "User"."username"
          FROM "UserChat"
          LEFT JOIN "User" ON "User"."id"="UserChat"."userId"
          WHERE "UserChat"."userId" != $1 AND "UserChat"."chatId" = $2
          LIMIT 1;
          `,
          [userId, chatId],
        );
        const participantUsername = queryResult[0].username;

        const dbmessages = await Message.find({
          where: { chatId },
          select: ['userId', 'text', 'sentAt', 'id'],
        });

        const messages = dbmessages.map(
          (msg) => ({
            username: msg.userId !== userId ? participantUsername : username,
            text: msg.text,
            sentAt: msg.sentAt,
            id: msg.id,
          }),
        );

        return { chatId, messages, participantUsername };
      }),
    );

    return userChatsWithMessages;
  } catch (e) {
    logger.error(e);
    return [];
  }
};
