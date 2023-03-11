import { UseGuards } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ConversationService } from "~/conversation/conversation.service";
import { Conversation } from "~/conversation/entities/conversation.entity";
import { GraphqlGuard } from '../../auth/graphql.guard';
import { UserDecorator } from "../decorator";
import { MessageService } from '../../message/message.service';

@Resolver(of => Conversation)
@UseGuards(GraphqlGuard)
export class ConversationResolver{
    constructor(
        private readonly conversationService: ConversationService,
        private readonly messageService: MessageService
    ){}
    @Query(()=> [Conversation], {name: "conversations"})
    async getMyConversations(@UserDecorator() {_id}: {
        _id: string,
        username: string
    }){
        const response = await  this.conversationService.getMany(_id)
        console.log("🚀 ~ file: conversation.ts:22 ~ ConversationResolver ~ getMyConversations ~ response", response);
        return response;
    }
    @ResolveField("members")
    async members(@Parent() conversation: Conversation){
        const {_id} = conversation;
        const response = await this.conversationService.getMembers(_id);
        return response;
    }
    @Query(()=> Conversation, {name: "conversation"})
    async getConversation(
        @Args('_id', {type: ()=> String} )_id: string
    ){
        return this.conversationService.getOne({_id});
    }
}