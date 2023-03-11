import { Args, Query, Resolver } from "@nestjs/graphql";
import { Message } from "~/message/entities/message.entity";
import { MessageService } from "~/message/message.service";

@Resolver(of => Message)
export class MessageResolver{
    constructor(
        private readonly messageService: MessageService
    ){}
    @Query(()=> Number, {name: "getCount"})
    async getCount(
        @Args("destination", {type: ()=> String}) destination: string
    ){
        return this.messageService.getCount(destination);
    }
    @Query(()=> [Message], {name: "messages"})
    async getMany(
        @Args("destination",{type : ()=> String}) destination: string,
        @Args("take", {type: ()=> Number,nullable: true}) take: number,
        @Args("skip", {type: ()=> Number,nullable: true}) skip: number
    ){
        const response = await this.messageService.getMany(destination,{
            take,
            skip
        });
        // console.log("🚀 ~ file: message.ts:26 ~ MessageResolver ~ response", response)
        return response;
    }
}