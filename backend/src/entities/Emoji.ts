import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  TableForeignKey,
} from 'typeorm';
import { Conversation } from '~/conversation/entities/conversation.entity';
import { User } from '../user/entities/user.entity';

@Entity()
export class Emoji {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  userId: User | string;
  @ManyToOne((type) => Conversation, (Conversation) => Conversation._id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: "convesaitonId"
  })
  conversationId: Conversation | string;
  @Column({
    default: '2764-fe0f',
  })
  emoji: string;
  @Column({
    default: 'neutral',
  })
  skinTone: string;
}
