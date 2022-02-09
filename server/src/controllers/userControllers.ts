import 'reflect-metadata';
import { Request, Response } from 'express';
import User from '../entities/User';

// eslint-disable-next-line no-unused-vars
export const dummy = async (_req: Request, _res: Response) => { };

export const getUser = async (_: Request, res: Response) => {
  const id = res.locals.payload.userId;
  const user = await User.findOne(
    { where: { id }, select: ['username', 'email', 'id'] },
  );

  if (!user) {
    return res.status(404).send({
      message: 'User with given Id not found',
    });
  }

  return res.status(200).json(user);
};
