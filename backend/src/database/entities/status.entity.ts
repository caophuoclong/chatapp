import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";
@ObjectType()
@Entity()
export class Status{
    @Field()
    @PrimaryColumn()
    code: string;
    @Field()

    @Column()
    name: string;
}