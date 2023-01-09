import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { ConversationService } from "~/conversation/conversation.service";
import { Conversation } from "~/conversation/entities/conversation.entity";
import { GraphqlGuard } from '../../auth/graphql.guard';
import { UserDecorator } from "../decorator";

@Resolver(of => Conversation)
@UseGuards(GraphqlGuard)
export class ConversationResolver{
    constructor(
        private readonly conversationService: ConversationService
    ){}
    @Query(()=> [Conversation], {name: "conversations"})
    async getMyConversations(@UserDecorator() user: {
        _id: string,
        username: string
    }){
        
    }
    @Query(()=> Conversation, {name: "conversation"})
    async getConversation(
        @Args('_id', {type: ()=> String} )_id: string
    ){
        return this.conversationService.getConversationById(_id);
    }
}