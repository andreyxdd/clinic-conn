import {
  Entity, PrimaryGeneratedColumn, Column,
  BaseEntity, ManyToOne, JoinColumn,
} from 'typeorm';
import User from './User';
import Chat from './Chat';

@Entity({ name: 'Message' })
class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;

  //--
  @Column()
    userId: number;

  @ManyToOne(() => User, (user) => user.messages)

  @JoinColumn({ name: 'userId' })
    user: User;
  //--

  //--
  @Column()
    chatId: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)

  @JoinColumn({ name: 'chatId' })
    chat: Chat;
  //--

  @Column({ type: 'text' })
    text: string;

  @Column({ type: 'timestamp' })
    sentAt: Date;
}

export default Message;
