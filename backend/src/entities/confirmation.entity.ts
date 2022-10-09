import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../user/entities/user.entity';

@Entity()
export class Confirmation{
    @PrimaryGeneratedColumn("uuid")
    _id: string;
    @OneToOne(type => User, user => user, {onDelete: "CASCADE"})
    @JoinColumn()
    user: User;
    @Column()
    @Index()
    token: string;
}