import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "~/message/entities/message.entity";

@Entity()
export class Attachment{
    @PrimaryGeneratedColumn("uuid")
    _id: string;
    @Column()
    type: string;
    @Column()
    url: string;
    @ManyToOne(type => Message, message => message._id)
    message: Message;
}