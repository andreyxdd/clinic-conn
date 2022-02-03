/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import {
  Query, Resolver, Mutation, Arg, Ctx, UseMiddleware,
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { verify } from 'jsonwebtoken';
import {
  createAccessToken, sendRefreshToken, isAuth, revokeRefreshTokensForUser, createRefreshToken,
} from './auth';
import User from './entity/User';
import RegisterResponse from './responses/RegisterResponse';
import LoginResponse from './responses/LoginResponse';
import { AuthContext } from './types';

@Resolver()
class UserResolver {
  val: string;

  constructor() {
    this.val = 'hi!';
  }

  @Query(() => String)
  hello() {
    return this.val;
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: AuthContext) {
    return `your user id is ${payload!.userId}`;
  }

  @Query(() => RegisterResponse)
  async emailCheck(@Arg('email') email: string) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return {
        ok: false,
        error: 'Account with the same email already exists',
        field: 'email',
      };
    }
    return { ok: true };
  }

  @Query(() => RegisterResponse)
  async usernameCheck(@Arg('username') username: string) {
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return {
        ok: false,
        error: 'Account with the same username already exists',
        field: 'username',
      };
    }
    return { ok: true };
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  user(
    @Ctx() context: AuthContext,
  ) {
    const { authorization } = context.req.headers;

    if (!authorization) { return null; }

    try {
      const token = authorization?.split(' ')[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload.userId);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Arg('username') username: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('first_name', { nullable: true }) first_name?: string,
    @Arg('last_name', { nullable: true }) last_name?: string,
    @Arg('birthday', { nullable: true }) birthday?: string,
  ) {
    try {
      const hashedPassword = await hash(password, 12);
      await User.insert({
        username,
        email,
        password: hashedPassword,
        first_name,
        last_name,
        birthday,
      });
    } catch (err) {
      console.log(err);
      return {
        ok: false, error: 'Internal Server Error',
      };
    }
    return {
      ok: true,
    };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: AuthContext,
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Incorrect email');
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error('Incorrect password');
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(
    @Ctx() { res }: AuthContext,
  ) {
    sendRefreshToken(res, '');

    return true;
  }

  // DONT USE BELOW IN THR PRODUCTION
  // ONLY FOR TESTING
  @Mutation(() => Boolean)
  async revokeRefreshToken(
    @Arg('email') email: string,
  ) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Incorrect email');
    }

    return revokeRefreshTokensForUser(user);
  }
}

export default UserResolver;
