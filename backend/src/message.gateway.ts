import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import WsGuards from './auth/ws-auth.guard';
import { MessageService } from './message/message.service';
import { UserService } from './user/user.service';
import { ConversationService } from './conversation/conversation.service';
import { CreateMessageDto } from './message/dto/create-message.dto';
import CustomSocket from './interfaces/CustomInterface';
import { Message } from './message/entities/message.entity';
import  {Cache}  from 'cache-manager';

@WebSocketGateway(3001,{
  cors:{
    origin: "*",
  }
})
export class MessageGateway {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ){}
  @UseGuards(WsGuards)
  @SubscribeMessage('createMessage')
  async handleMessage(client: CustomSocket, payload: CreateMessageDto): Promise<WsResponse<Message>> {
    const {_id} = client.user;
    const response = await this.messageService.create(_id, payload);
    const destinationId = payload.destination;
    const message = response.data;
    message.destination = destinationId
    client.broadcast.to(destinationId).emit("newMessage", message);
    return {
      event: "newMessage",
      data: message
    }
  }
}
