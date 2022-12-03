import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "~/user/entities/user.entity";

@Entity()
export class PasswordResetToken{
    @OneToOne(type => User, {onDelete: "CASCADE"})
    @JoinColumn()
    user: User;
    @PrimaryColumn({
        nullable: false,
    })
    token: string;
    @Column({
        type: "bigint"
    })
    token_expire: number
    @BeforeInsert()
    setExpiredTime(){
        const date = Date.now();
        this.token_expire = date + 15 * 60*1000;
    }
}