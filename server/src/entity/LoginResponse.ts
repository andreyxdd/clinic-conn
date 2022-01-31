import { Field, ObjectType } from 'type-graphql';
import User from './User';

@ObjectType()
class LoginResponse {
  @Field()
    accessToken: string;

  @Field(() => User)
    user: User;
}

export default LoginResponse;
