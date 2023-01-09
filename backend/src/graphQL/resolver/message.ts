import { Resolver } from "@nestjs/graphql";
import { Message } from "~/message/entities/message.entity";
import { MessageService } from "~/message/message.service";

@Resolver(of => Message)
export class MessageResolver{
    constructor(
        private readonly messageService: MessageService
    ){}
}