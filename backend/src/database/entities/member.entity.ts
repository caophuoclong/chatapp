import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Conversation } from "~/conversation/entities/conversation.entity";
import { User } from "~/user/entities/user.entity";

@Entity()
export class Member{

    @PrimaryColumn("uuid")
    userId: string;
    @PrimaryColumn("uuid")
    conversationId: string;
    @ManyToOne(type => User, user => user._id,{onDelete: "CASCADE"})
    @JoinColumn({
        name: "userId"
    })
    user: User;
    @ManyToOne(type => Conversation,conversation => conversation._id, {onDelete: "CASCADE"})
    @JoinColumn({
        name: "conversationId"
    })
    conversation: Conversation;
    @Column({default: false})
    isBlocked: boolean;
    @Column({default: new Date().getTime(), type: "bigint"})
    createdAt: number;
    @Column({default: 0, type: "bigint"})
    deletedAt: number;
    @Column({default: false})
    isDeleted: boolean;
}