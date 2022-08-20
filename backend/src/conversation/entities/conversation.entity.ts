import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "~/message/entities/message.entity";
import { User } from "~/user/entities/user.entity";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn("uuid")
    _id: string;
    @Column()
    name: string;
    @ManyToMany(type => User, user => user._id)
    @JoinTable({
        name: "isMember",
        joinColumn: {
            name: "conversation_id"
        }
    })
    participants: User[];
    @Column()
    type: string;
    @Column({
        type: Boolean,
        default: false
    })
    visible: boolean;
    @OneToMany(type => Message, message => message._id)
    messages: Message[];
    @ManyToOne(type => User, user => user._id)
    owner: User;
}
