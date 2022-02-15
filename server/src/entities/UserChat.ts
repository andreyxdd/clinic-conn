import {
  Entity, JoinColumn, ManyToOne,
  BaseEntity, CreateDateColumn, PrimaryColumn,
} from 'typeorm';
import User from './User';
import Chat from './Chat';

@Entity({ name: 'UserChat' })
class UserChat extends BaseEntity {
  // --
  @PrimaryColumn()
    userId: number;

  @ManyToOne(() => User, (user) => user.chatConnections, { primary: true })
    @JoinColumn({ name: 'userId' })
    user: User;
  // --

  // --
  @PrimaryColumn()
    chatId: number;

  @ManyToOne(() => Chat, (chat) => chat.userConnections, { primary: true })
    @JoinColumn({ name: 'chatId' })
    chat: Chat;

  // --
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}

export default UserChat;
