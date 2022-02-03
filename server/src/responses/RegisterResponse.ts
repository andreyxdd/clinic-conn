import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class RegisterResponse {
  @Field()
    ok: boolean;

  @Field({ nullable: true })
    error?: string;

  @Field({ nullable: true })
    field?: string;
}

export default RegisterResponse;
