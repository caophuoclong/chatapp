import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Conversation } from "~/conversation/entities/conversation.entity";
import { User } from "~/user/entities/user.entity";

@Entity()
export class Member{
    @PrimaryColumn()
    userId: string;
    @ManyToOne(type => User)
    @JoinColumn({name: "userId"})
    user: User;
    @PrimaryColumn()
    conversationId: string;
    @ManyToOne(type => Conversation, {onDelete: "CASCADE"})
    @JoinColumn({name: "conversationId"})
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