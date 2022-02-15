import {
  Entity, PrimaryGeneratedColumn, Column,
  BaseEntity, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import User from './User';

@Entity({ name: 'UserVerification' })
class UserVerification extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;

  //--
  @Column()
    userId: string;

  @ManyToOne(() => User, (user) => user.userVerifications)

  @JoinColumn({ name: 'userId' })
    user: User;
  //--

  @Column()
    emailToken: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}

export default UserVerification;
