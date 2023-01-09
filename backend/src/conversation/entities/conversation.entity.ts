import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Emoji } from '~/database/entities/Emoji';
import { Member } from '~/database/entities/member.entity';
import { Message } from '~/message/entities/message.entity';
import { User } from '~/user/entities/user.entity';
import { FriendShip } from '../../friendship/entities/friendship.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity()
export class Conversation {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  @Field()
  @Column({
    nullable: true,
  })
  
  name: string;
  @Field(type=> [Member])
  @OneToMany(type => Member, member => member.conversation)
  members: Member[];
  @Field()
  @Column({
    default: 'direct',
  })
  type: "group" | "direct";
  @Field()
  @Column({
    type: Boolean,
    default: false,
  })
  visible: boolean;
  @Field( type => [Message])
  @OneToMany((type) => Message, (message) => message.destination)
  messages: Message[];
  @Field(type => User)
  @ManyToOne((type) => User, (user) => user._id)
  owner: User;
  @Field()
  @Column({
    nullable: true
  })
  avatarUrl: string;
  @Field()
  @Column({
    default: false
  })
  isBlocked: boolean;
  @ManyToOne(type => User, u => u._id)
  blockBy: User;
  @Field()
  @Column({
    default: false
  })
  isDeleted: boolean;
  @Field()
  @Column({
    type:"bigint",
    default: new Date().getTime()
})
  deletedAt: number;
  @Field()
  @Column({
    type:"bigint",
    default: new Date().getTime()
})
createdAt: number;
@Field(type=> Message)
  @OneToOne(type => Message, m => m._id, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "lastmessage"
  })
  lastMessage: Message;
  @Field(type => FriendShip)
  @OneToOne(type => FriendShip, f => f._id,{
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "friendship",
  })
  friendship: FriendShip;
  @Field()
  @Column({
    type: "bigint",
    default: new Date().getTime()
  })
  updateAt: number;
  @Field(type => [Emoji])
  @OneToMany(type => Emoji, e => e.conversation,{
    cascade: true
  })
  emoji: Emoji[]
}
