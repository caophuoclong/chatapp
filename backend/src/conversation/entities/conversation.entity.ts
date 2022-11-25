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

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  @Column({
    nullable: true,
  })
  name: string;
  @OneToMany(type => Member, member => member.conversation)
  participants: Member[];
  @Column({
    default: 'direct',
  })
  type: "group" | "direct";
  @Column({
    type: Boolean,
    default: false,
  })
  visible: boolean;
  @OneToMany((type) => Message, (message) => message.destination)
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
  @Column({
    type:"bigint",
    default: new Date().getTime()
})
  deletedAt: number;
  @Column({
    type:"bigint",
    default: new Date().getTime()
})
createdAt: number;
  @OneToOne(type => Message, m => m._id, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "lastmessage"
  })
  lastMessage: Message
  @OneToOne(type => FriendShip, f => f._id,{
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "friendship",
  })
  friendship: FriendShip
  @Column({
    type: "bigint",
    default: new Date().getTime()
  })
  updateAt: number;
  @OneToMany(type => Emoji, e => e.conversationId,{
    cascade: true
  })
  emoji: Emoji[]
}
