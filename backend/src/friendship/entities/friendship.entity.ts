import { Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "~/user/entities/user.entity";
import { Status } from "../../entities/status.entity";
@Entity()
export class FriendShip{
    @PrimaryGeneratedColumn()
    _id: number;
    @ManyToOne(type => User, user => user._id )
    userRequest: User;
    @ManyToOne(type => User, user=> user._id)
    userAddress: User;
    @ManyToOne(type => Status, s => s.code)
    statusCode: Status;
}