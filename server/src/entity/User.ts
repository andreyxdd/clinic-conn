import { Field, ObjectType, Int } from 'type-graphql';
import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateDateColumn, CreateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'user' })
class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
    id: number;

  @Field()
  @Column()
    username: string;

  @Field()
  @Column()
    email: string;

  @Column()
    password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
    first_name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
    last_name?: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
    birthday?: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

  @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamp', nullable: true })
    verified_at: Date;

  @Field()
  @Column({ default: false })
    is_verified: boolean;

  @Field()
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

  @Field()
  @Column({ type: 'int', default: 0 })
    tokenVersion: number;
}

export default User;
