import {
  Entity, PrimaryGeneratedColumn,
  BaseEntity, CreateDateColumn, OneToMany,
} from 'typeorm';
import UserChat from './UserChat';

@Entity({ name: 'Chat' })
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @OneToMany(() => UserChat, (uc) => uc.user)
    userConnections: UserChat[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}

export default Chat;
