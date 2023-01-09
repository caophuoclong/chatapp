import { Field, ObjectType } from "@nestjs/graphql";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "~/user/entities/user.entity";
@ObjectType()
@Entity()
export class PasswordResetToken{
    @Field(type =>User)

    @OneToOne(type => User, {onDelete: "CASCADE"})
    @JoinColumn()
    user: User;
    @Field()

    @PrimaryColumn({
        nullable: false,
    })
    token: string;
    @Field()

    @Column({
        type: "bigint"
    })
    token_expire: number;
    @BeforeInsert()
    setExpiredTime(){
        const date = Date.now();
        this.token_expire = date + 15 * 60*1000;
    }
}