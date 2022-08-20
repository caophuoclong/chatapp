import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Status{
    @PrimaryColumn()
    code: string;
    @Column()
    name: string;
}