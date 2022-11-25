import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "~/user/entities/user.entity";

@Entity()
export class PasswordResetToken{
    @PrimaryColumn({
        type: "uuid"
    })
    user: string;
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