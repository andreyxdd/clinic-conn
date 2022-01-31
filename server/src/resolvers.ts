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
import LoginResponse from './entity/LoginResponse';
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

  @Mutation(() => Boolean)
  async register(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
  ) {
    try {
      const hashedPassword = await hash(password, 12);
      await User.insert({
        name,
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
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
