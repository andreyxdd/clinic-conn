import {
  Entity, PrimaryGeneratedColumn, Column,
  BaseEntity, UpdateDateColumn, CreateDateColumn, OneToMany,
} from 'typeorm';
import UserVerification from './UserVerification';
import UserChat from './UserChat';
import Message from './Message';

@Entity({ name: 'User' })
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    username: string;

  @Column()
    email: string;

  @Column()
    password: string;

  @Column({ nullable: true })
    firstName?: string;

  @Column({ nullable: true })
    lastName?: string;

  @Column({ type: 'date', nullable: true })
    birthday?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
    verifiedAt: Date;

  @Column({ default: false })
    isVerified: boolean;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;

  @Column({ type: 'int', default: 0 })
    tokenVersion: number;

  @OneToMany(() => UserVerification, (userVerification) => userVerification.user)
    userVerifications: UserVerification[];

  @OneToMany(() => UserChat, (uc) => uc.user)
    chatConnections: UserChat[];

  @OneToMany(() => Message, (msg) => msg.user)
    messages: Message[];
}

export default User;
