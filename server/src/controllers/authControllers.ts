import 'reflect-metadata';
import { Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import { verify } from 'jsonwebtoken';
import User from '../entities/User';
import {
  createAccessToken, createRefreshToken,
  attachRefreshToken, revokeRefreshTokensForUser,
} from '../utils/authUtils';
import { timeToUpdateRefreshToken } from '../config/index';

//--

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.send({
        message: 'User with provided email not found',
      });
    }

    const valid = await compare(password as string, user!.password);

    if (!valid) {
      return res.send({
        message: 'Inalid password provided',
      });
    }

    attachRefreshToken(res, createRefreshToken(user!));

    return res.status(200).send({
      accessToken: createAccessToken(user!),
      user,
    });
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
};

export const logout = async (_: Request, res: Response) => {
  console.log('logout?');
  attachRefreshToken(res, '');
  console.log('logout?2');
  return res.status(200).send();
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      birthday,
    } = req.body;

    await User.insert({
      username,
      email,
      password: await hash(password, 12),
      firstName,
      lastName,
      birthday,
    });

    return res.status(200).send({ ok: true });
  } catch (e) {
    return res.status(500).send({ ok: false, error: e.message });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.jid;

    // console.log('From referesh token', refreshToken);

    if (!refreshToken) {
      res.send({ ok: false, accessToken: '' });
    }

    let refreshPayload: any = null;

    refreshPayload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    // refresh token is valid
    const user = await User.findOne({ id: refreshPayload.userId });

    if (!user) {
      return res.status(404).send({
        message: 'User not found',
      });
    }

    if (user?.tokenVersion !== refreshPayload.tokenVersion) {
      return res.status(404).send({
        message: 'Refresh token version do not coincide',
      });
    }

    const expiration = new Date(refreshPayload.exp * 1000);
    const now = new Date();
    const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000;

    if (secondsUntilExpiration < timeToUpdateRefreshToken) {
      attachRefreshToken(res, createRefreshToken(user!));
    }

    return res.status(200).send({
      accessToken: createAccessToken(user!),
      user,
    });
  } catch (e) {
    attachRefreshToken(res, '');
    return res.status(500).send({ message: e.message });
  }
};

export const revokeRefreshToken = async (_: Request, res: Response) => {
  const id = res.locals.payload.userId; // from middleware
  const user = await User.findOne({ where: { id } });

  if (!user) {
    return res.status(404).send({
      message: 'User with given Id not found',
    });
  }

  const revokedStatus = await revokeRefreshTokensForUser(user!);

  return res.status(revokedStatus ? 200 : 500);
};

export const checkUsername = async (req: Request, res: Response) => {
  const existingUsername = await User.findOne({
    where: { username: req.body.username },
  });

  if (existingUsername) {
    return res.status(200).send({
      ok: false,
      error: 'Account with the same username already exists',
      field: 'username',
    });
  }
  return res.status(200).send({ ok: true });
};

export const checkEmail = async (req: Request, res: Response) => {
  const existingEmail = await User.findOne({
    where: { email: req.body.email },
  });

  if (existingEmail) {
    return res.status(200).send({
      ok: false,
      error: 'Account with the same email already exists',
      field: 'email',
    });
  }
  return res.status(200).send({ ok: true });
};
