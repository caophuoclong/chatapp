import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Table } from "typeorm";
import { Conversation } from "~/conversation/entities/conversation.entity";
import { Assets } from "~/database/entities/assets.entity";
import { Emoji } from "~/database/entities/Emoji";
import { Member } from "~/database/entities/member.entity";
import { FriendShip } from "~/friendship/entities/friendship.entity";
import { Message } from "~/message/entities/message.entity";
import { UnRead } from '../../unread/entities/unread.entity';
export enum Gender{
    MALE= "male",
    FEMALE="female",
    OTHER="other"
}
@Entity({
    name: "user"
})
export class User {
    @Column()
    @PrimaryGeneratedColumn("uuid")
    _id: string;
    @Column({
        unique: true
    })
    username: string;
    @Column({
        select: false
    })
    password: string;
    @Column()
    name: string;
    @Column({
        unique: true
    })
    email: string;
    @Column({
        nullable: true,
        default: null
    })
    phone: string;
    @Column({
        nullable: true,
        default: null
    })
    avatarUrl: string;
    @Column({
        nullable: true,
        default: null
    })
    birthday: string;
    @Column({
        select: false
    })
    
    salt: string;
    @Column(
        "bigint"
    ,{
        nullable: true
    })
    lastOnline: number;
    @OneToMany(type => FriendShip, fri => fri.userRequest)
    friendRequest: FriendShip[];
    @OneToMany(type => FriendShip, fri => fri.userAddress)
    friendAddress: FriendShip[];
    @OneToMany(type => Member, member => member.user)
    conversations: Member[];
    @OneToMany(type => Conversation, con => con.owner)
    owner: Conversation[];
    @OneToMany(type => Message, message => message.sender)
    messages: Message[];
    @OneToMany(type => UnRead, unread => unread.user)
    unreadMessages: UnRead[];
    @OneToMany(type => Conversation, c => c._id)
    conversationBlocked: Conversation[];
    @Column({
        type: "enum",
        enum: Gender,
        default: Gender.OTHER
    })
    gender: Gender
    @Column({
        type: "boolean",
        default: false
    })
    active: boolean;
    @OneToMany(type => Emoji, e => e.userId, {
        cascade: true
    })
    emoji: Emoji[];
    @OneToMany(type => Assets, a => a.owner,{
        cascade: true
    })
    assets: Assets[];
}
