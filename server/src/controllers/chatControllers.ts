import 'reflect-metadata';
import { Request, Response } from 'express';
import User from '../entities/User';
import Chat from '../entities/Chat';
import UserChat from '../entities/UserChat';
import logger from '../utils/logUtils';

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
    const UseChatsOfInitiator = await UserChat.find({
      where: { userId: initiatorId },
      select: ['chatId'],
    });
    const chatIdsOfInitiator = UseChatsOfInitiator.map((uc: UserChat) => uc.chatId);

    const UseChatsOfTarget = await UserChat.find({
      where: { userId: 17 },
      select: ['chatId'],
    });
    const chatIdsOfTarget = UseChatsOfTarget.map((uc: UserChat) => uc.chatId);

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
