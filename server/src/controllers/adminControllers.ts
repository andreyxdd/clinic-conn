import 'reflect-metadata';
import { Request, Response } from 'express';
import User from '../entities/User';

// eslint-disable-next-line no-unused-vars
export const dummy = async (_req: Request, _res: Response) => { };

export const getUsers = async (_: Request, res: Response) => {
  const users = await User.find({ select: ['username', 'email', 'id'] });
  return res.status(200).send(users);
};
