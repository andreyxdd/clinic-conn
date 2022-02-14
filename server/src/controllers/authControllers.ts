import 'reflect-metadata';
import { Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import { verify } from 'jsonwebtoken';
import User from '../entities/User';
import UserVerification from '../entities/UserVerification';
import {
  createAccessToken, createRefreshToken,
  attachRefreshToken, revokeRefreshTokensForUser, createConfirmationToken,
} from '../utils/authUtils';
import { timeToUpdateRefreshToken } from '../config/index';
import { sendConfirmation } from '../utils/emailUtils';

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

  attachRefreshToken(res, '');

  const revokedStatus = await revokeRefreshTokensForUser(user!);

  return res.status(revokedStatus ? 200 : 500);
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

    // inserting new user
    const { identifiers } = await User.insert({
      username,
      email,
      password: await hash(password, 12),
      firstName,
      lastName,
      birthday,
    });
    const { id } = identifiers[0];

    // creating verification token
    const emailToken = createConfirmationToken(id);

    // inserting new user verification record
    UserVerification.insert({
      userId: id,
      emailToken,
    });

    // generating confirmation link
    const confirmationLink = `http://${req.headers.host}/api/auth/confirmation/${emailToken}`;

    // emaling user
    sendConfirmation(email, username, confirmationLink);

    return res.status(200).send();
  } catch (e) {
    return res.status(500).send();
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.jid;

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
  try {
    let payload: any = null;
    payload = verify(req.params.token, process.env.EMAIL_TOKEN_SECRET!);
    await User.update(
      { id: payload.userId },
      { isVerified: true },
    );
  } catch (e) {
    res.status(400).send({ message: e });
  }

  return res.redirect(`${process.env.CLIENT_SIDE_URL}/login`);
};
