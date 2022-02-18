import {
  Entity, JoinColumn, ManyToOne,
  BaseEntity, PrimaryColumn,
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
}

export default UserChat;
