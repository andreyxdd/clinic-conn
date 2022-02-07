import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateDateColumn, CreateDateColumn,
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
    first_name?: string;

  @Column({ nullable: true })
    last_name?: string;

  @Column({ type: 'date', nullable: true })
    birthday?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
    verified_at: Date;

  @Column({ default: false })
    is_verified: boolean;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

  @Column({ type: 'int', default: 0 })
    tokenVersion: number;
}

export default User;
