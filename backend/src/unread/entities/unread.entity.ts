import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "~/conversation/entities/conversation.entity";
import { Message } from "~/message/entities/message.entity";
import { User } from "~/user/entities/user.entity";

@Entity({
    name: "unread"
})
export class UnRead{
@PrimaryGeneratedColumn()
_id: number;

@ManyToOne(type => User, user => user._id)
user: User;
@ManyToOne(type => Conversation, con => con._id)
conversation: Conversation;
@ManyToOne(type => Message, mes => mes._id)
message: Message;

}