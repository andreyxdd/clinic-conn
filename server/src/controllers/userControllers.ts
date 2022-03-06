import 'reflect-metadata';
import { Request, Response } from 'express';
import User from '../entities/User';
// import logger from '../utils/log';

export const getMe = async (_: Request, res: Response) => {
  const id = res.locals.payload.userId;
  const user = await User.findOne(
    { where: { id }, select: ['username', 'id'] },
  );

  if (!user) {
    return res.status(404).send({
      message: 'User with given Id not found',
    });
  }

  return res.status(200).json(user);
};

export const getUser = async (req: Request, res: Response) => {
  const { username } = req.query;
  const userData = await User.findOne({
    where: { username },
    select: ['id', 'username', 'firstName', 'lastName', 'birthday'],
  });

  if (!userData) {
    return res.status(404).send({ message: 'User with given username not found' });
  }

  return res.status(200).json(userData);
};
