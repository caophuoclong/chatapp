import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Table } from "typeorm";
import { Conversation } from "~/conversation/entities/conversation.entity";
import { FriendShip } from "~/friendship/entities/friendship.entity";
import { Message } from "~/message/entities/message.entity";
import { UnRead } from '../../unread/entities/unread.entity';

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
    @Column()
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
    @Column()
    salt: string;
    @OneToMany(type => FriendShip, fri => fri.userRequest)
    friendRequest: FriendShip[];
    @OneToMany(type => FriendShip, fri => fri.userAddress)
    friendAddress: FriendShip[];
    @ManyToMany(type => Conversation, con => con._id)
    @JoinTable({
        name: "isMember",
        joinColumn: {
            name: "user_id",
        }
    })
    conversations: Conversation[];
    @OneToMany(type => Conversation, con => con.owner)
    owner: Conversation[];
    @OneToMany(type => Message, message => message.sender)
    messages: Message[];
    @OneToMany(type => UnRead, unread => unread.user)
    unreadMessages: UnRead[];
}
