import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../user/entities/user.entity';
import { Field, ObjectType } from "@nestjs/graphql";
@ObjectType()
@Entity()
export class Confirmation{
    @Field()
    @PrimaryGeneratedColumn("uuid")
    _id: string;
    @Field(type =>User)
    @OneToOne(type => User, user => user, {onDelete: "CASCADE"})
    @JoinColumn()
    user: User;
    @Field()
    @Column()
    @Index()
    token: string;
}