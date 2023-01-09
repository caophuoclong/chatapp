import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Attachment } from "~/attachment/entities/attachment.entity";
import { Conversation } from "~/conversation/entities/conversation.entity";
import { Assets } from "~/database/entities/assets.entity";
import { User } from "~/user/entities/user.entity";
export enum MessageStatusType{
    SENT = "SENT",
    RECEIVED = "RECEIVED",
    SEEN = "SEEN"
}
export enum MessageType{
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    FILE = "FILE",
    EMOJI="EMOJI"
}
@ObjectType()
@Entity()
export class Message {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    _id: string;
    @Field(type=>User)
    @ManyToOne(type => User, user => user._id)
    sender: User;
        @Field(type => [Conversation])

    @ManyToOne(type => Conversation, con => con._id,{
        onDelete: "CASCADE"
    })
    destination: Conversation;
        @Field(type => [Message])

    @OneToOne(type => Message, mes => mes._id)
    parentMessage: Message;
    @Field()
    @Column({
        type: "longtext"
    })
    content: string;
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
    createdAt: number;
        @Field()

    @Column({
        type: "enum",
        enum: MessageStatusType,
        default: MessageStatusType.SENT
    },
    )
    status: MessageStatusType;
        @Field()

    @Column({
        type: "enum",
        enum: MessageType,
        default: MessageType.TEXT
    })
    type: MessageType;
        @Field()

    @Column({
        type: "int",
        default: 1,
    })
    scale: number;
        @Field()

    @Column({
        type: "boolean",
        default: false
    })
    isRecall: boolean;
        @Field(type => Assets)

    @ManyToMany(type => Assets)
    @JoinTable({
        name: "messageAttachment",
    })
    attach: Assets[]
}
