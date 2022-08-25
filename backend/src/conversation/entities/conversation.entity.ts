import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Message } from '~/message/entities/message.entity';
import { User } from '~/user/entities/user.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  @Column({
    nullable: true,
  })
  name: string;
  @ManyToMany((type) => User, (user) => user.conversations)
  @JoinTable({
    name: 'isMember',
    joinColumn: {
      name: 'conversation_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  participants: User[];
  @Column({
    default: 'direct',
  })
  type: string;
  @Column({
    type: Boolean,
    default: false,
  })
  visible: boolean;
  @OneToMany((type) => Message, (message) => message._id)
  messages: Message[];
  @ManyToOne((type) => User, (user) => user._id)
  owner: User;
  @Column({
    nullable: true
  })
  avatarUrl: string;
  @Column({
    default: false
  })
  isBlocked: boolean;
  @ManyToOne(type => User, u => u._id)
  blockBy: User;
  @Column({
    default: false
  })
  isDeleted: boolean;
  @DeleteDateColumn({
    type: "timestamp",
    nullable: true
  })
  deletedAt: Date;
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
