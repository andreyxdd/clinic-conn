import { Field, ObjectType, Int } from 'type-graphql';
import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity,
} from 'typeorm';

@ObjectType()
@Entity()
class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
    id: number;

  @Field()
  @Column()
    name: string;

  @Field()
  @Column()
    email: string;

  @Column()
    password: string;

  @Column('int', { default: 0 })
    tokenVersion: number;
}

export default User;
