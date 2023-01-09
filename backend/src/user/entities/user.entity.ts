import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Table } from "typeorm";
import { Conversation } from "~/conversation/entities/conversation.entity";
import { Assets } from "~/database/entities/assets.entity";
import { Emoji } from "~/database/entities/Emoji";
import { Member } from "~/database/entities/member.entity";
import { FriendShip } from "~/friendship/entities/friendship.entity";
import { Message } from "~/message/entities/message.entity";
import { UnRead } from '../../unread/entities/unread.entity';
import { Field, ObjectType } from "@nestjs/graphql";
export enum Gender{
    MALE= "male",
    FEMALE="female",
    OTHER="other"
}
@ObjectType()
@Entity({
    name: "user"
})
export class User {
    @Field()
    @Column()
    @PrimaryGeneratedColumn("uuid")
    _id: string;
    @Field()
    @Column({
        unique: true
    })
    username: string;
        @Field()

    @Column({
        select: false
    })
    password: string;
        @Field()
    @Field()

    @Column()
    name: string;
        @Field()

    @Column({
        unique: true
    })
    email: string;
        @Field()

    @Column({
        nullable: true,
        default: null
    })
    phone: string;
        @Field()

    @Column({
        nullable: true,
        default: null
    })
    avatarUrl: string;
        @Field()

    @Column({
        nullable: true,
        default: null
    })
    birthday: string;
    @Column({
        select: false
    })
    
    salt: string;
        @Field()

    @Column(
        "bigint"
    ,{
        nullable: true
    })
    lastOnline: number;
    @Field(type => [FriendShip])
    @OneToMany(type => FriendShip, fri => fri.userRequest)
    friendRequest: FriendShip[];
        @Field(type => [FriendShip])

    @OneToMany(type => FriendShip, fri => fri.userAddress)
    friendAddress: FriendShip[];
        @Field(type => [Member])

    @OneToMany(type => Member, member => member.user)
    conversations: Conversation[];
    @Field(type => [Conversation])
    @OneToMany(type => Conversation, con => con.owner)
    owner: Conversation[];
    @OneToMany(type => Conversation, c => c._id)
    conversationBlocked: Conversation[];
    @Field()
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
    @OneToMany(type => Assets, a => a.owner,{
        cascade: true
    })
    assets: Assets[];

}
