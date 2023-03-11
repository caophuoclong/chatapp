import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Conversation } from '~/conversation/entities/conversation.entity';
import { User } from '~/user/entities/user.entity';
@ObjectType()
@Entity()
export class Member {
  @PrimaryColumn('uuid')
  userId: string;
  @PrimaryColumn('uuid')
  conversationId: string;
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user._id, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'userId',
  })
  user: User;
  @Field((type) => Conversation)
  @ManyToOne((type) => Conversation, (conversation) => conversation._id, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'conversationId',
  })
  conversation: Conversation;
  @Field()
  @Column({ default: false })
  isBlocked: boolean;
  @Field()
  @Column({ default: new Date().getTime(), type: 'bigint' })
  createdAt: number;
  @Field()
  @Column({ default: 0, type: 'bigint' })
  deletedAt: number;
  @Field()
  @Column({ default: false })
  isDeleted: boolean;
}
