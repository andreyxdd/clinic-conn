import 'reflect-metadata';
import { Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import { verify } from 'jsonwebtoken';
import User from '../entities/User';
import UserVerification from '../entities/UserVerification';
import {
  createAccessToken, createRefreshToken,
  attachRefreshToken, revokeRefreshTokensForUser, createConfirmationToken,
} from '../utils/auth';
import { timeToUpdateRefreshToken } from '../config/index';
import { sendConfirmation } from '../utils/email';
import logger from '../utils/log';

//--

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(403).send({
        field: 'email',
      });
    }

    const valid = await compare(password as string, user!.password);

    if (!valid) {
      return res.status(403).send({
        field: 'password',
      });
    }

    /* TODO: UNCOMMMENT IN RPODUCTION
    if (!user.isVerified) {
      return res.send({
      field: 'isVerified'
      });
    }
    */

    attachRefreshToken(res, createRefreshToken(user!));

    return res.status(200).send({
      accessToken: createAccessToken(user!),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },

    });
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
};

export const logout = async (_: Request, res: Response) => {
  const id = res.locals.payload.userId; // from middleware
  const user = await User.findOne({ where: { id } });

  if (!user) {
    return res.status(404).send({
      message: 'User with given Id not found',
    });
  }

  const revokedStatus = await revokeRefreshTokensForUser(user!);
  attachRefreshToken(res, '');

  return res.status(revokedStatus ? 200 : 500).send();
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

    //-----
    // unable to fix typeorm bug for incrementing primary index
    // TODO: swtich to prisma (or similar)
    const users = await User.find(
      { order: { id: 'DESC' } },
    );

    const lastUser = users[0];
    logger.info(lastUser);

    if (!lastUser) throw new Error('Can\'t find last user');

    // inserting new user
    await User.insert({
      id: lastUser.id + 1,
      username,
      email,
      password: await hash(password, 12),
      firstName,
      lastName,
      birthday,
    });
    //-----

    // creating verification token
    const emailToken = createConfirmationToken(lastUser.id + 1);

    // inserting new user verification record
    await UserVerification.insert({
      userId: lastUser.id + 1,
      emailToken,
    });

    // generating confirmation link
    const confirmationLink = `http://${req.headers.host}/api/auth/confirmation/${emailToken}`;

    logger.info(confirmationLink);

    // emailing user
    await sendConfirmation(email, username, confirmationLink);

    logger.info(confirmationLink);

    return res.status(200).send();
  } catch (e) {
    logger.info(e);
    return res.status(500).send();
  }
};

export const resendConfirmationLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    // inserting new user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).send();
    }

    if (user?.isVerified) {
      return res.status(403).send();
    }

    // creating verification token
    const emailToken = createConfirmationToken(user.id);

    // inserting new user verification record
    UserVerification.insert({
      userId: user.id,
      emailToken,
    });

    // generating confirmation link
    const confirmationLink = `http://${req.headers.host}/api/auth/confirmation/${emailToken}`;

    // emailing user
    sendConfirmation(email as string, user.username, confirmationLink);

    return res.status(200).send();
  } catch (e) {
    return res.status(500).send();
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.jid;

    if (!refreshToken) {
      return res.send({ ok: false, accessToken: '' });
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
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (e) {
    attachRefreshToken(res, '');
    return res.status(500).send({ message: e.message });
  }
};

export const checkUsername = async (req: Request, res: Response) => {
  const existingUsername = await User.findOne({
    where: { username: req.query.username },
  });

  if (existingUsername) {
    return res.status(200).send({
      ok: false,
      message: 'Account with the same username already exists',
    });
  }
  return res.status(200).send({ ok: true });
};

export const checkEmail = async (req: Request, res: Response) => {
  const existingEmail = await User.findOne({
    where: { email: req.query.email },
  });

  if (existingEmail) {
    return res.status(200).send({
      ok: false,
      message: 'Account with the same email already exists',
    });
  }
  return res.status(200).send({ ok: true });
};

export const confirmEmail = async (req: Request, res: Response) => {
  let payload: any = null;
  try {
    payload = verify(req.params.token, process.env.EMAIL_TOKEN_SECRET!);
  } catch (e) {
    res.redirect(`${process.env.CLIENT_SIDE_URL}/unsuccessful-confirmation`);
  }
  await User.update(
    { id: payload.userId },
    { isVerified: true },
  );

  return res.redirect(`${process.env.CLIENT_SIDE_URL}/login`);
};
