import { Request, Response } from 'express';

export interface IPayload{
  userId: string
}

export interface AuthContext{
  req: Request;
  res: Response;
  payload?: IPayload;
}

export interface IMessage{
  username: string;
  text: string;
  sentAt: Date;
  readAt: Date | null;
  id?: number;
}

export interface IChat{
  chatId: number;
  messages: Array<IMessage>
  participantUsername: string;
}

export interface IChats{
  chats: Array<IChat>;
}
