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
import { User } from '../../user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity()
export class Emoji {
  @Field()
    @PrimaryGeneratedColumn('uuid')
    _id: string;
  @Field(type => User)
  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Field(type => Conversation)
  @ManyToOne((type) => Conversation, (Conversation) => Conversation._id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: "convesaitonId"
  })
  conversation: Conversation;
  @Field()
  @Column({
    default: '2764-fe0f',
  })
  emoji: string;
  @Field()
  @Column({
    default: 'neutral',
  })
  skinTone: string;
}
