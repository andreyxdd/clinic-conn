import {
  Entity, PrimaryGeneratedColumn, Column,
  BaseEntity, UpdateDateColumn, CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
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
}

export default User;
