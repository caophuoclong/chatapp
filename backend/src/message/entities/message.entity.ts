import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Attachment } from "~/attachment/entities/attachment.entity";
import { Conversation } from "~/conversation/entities/conversation.entity";
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
@Entity()
export class Message {
    @PrimaryGeneratedColumn("uuid")
    _id: string;
    @ManyToOne(type => User, user => user._id)
    sender: User;
    @ManyToOne(type => Conversation, con => con._id,{
        onDelete: "CASCADE"
    })
    destination: Conversation;
    @OneToMany(type => Attachment, att => att._id)
    attachments: Attachment[];
    @OneToOne(type => Message, mes => mes._id)
    parentMessage: Message;
    @Column({
        type: "longtext"
    })
    content: string;
    @Column({
        default: false
    })
    isDeleted: boolean;
    @Column({
        type:"bigint",
        default: new Date().getTime()
    })
    createdAt: number;
    @Column({
        type: "enum",
        enum: MessageStatusType,
        default: MessageStatusType.SENT
    },
    )
    status: MessageStatusType;
    @Column({
        type: "enum",
        enum: MessageType,
        default: MessageType.TEXT
    })
    type: MessageType;
    @Column({
        type: "int",
        default: 1,
    })
    scale: number;
    @Column({
        type: "boolean",
        default: false
    })
    isRecall: boolean;
}
