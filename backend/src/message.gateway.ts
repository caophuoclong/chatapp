import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import WsGuards from './auth/ws-auth.guard';
import { MessageService } from './message/message.service';
import { UserService } from './user/user.service';
import { ConversationService } from './conversation/conversation.service';
import { CreateMessageDto } from './message/dto/create-message.dto';
import CustomSocket from './interfaces/CustomInterface';
import { Message } from './message/entities/message.entity';
import  {Cache}  from 'cache-manager';
import { RedisClientType } from 'redis';

@WebSocketGateway({
  cors:{
    origin: "*",
  }
})
export class MessageGateway {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    @Inject("REDIS_CLIENT")
    private readonly redisClient: RedisClientType
  ){}
  @WebSocketServer()
  server: Server;
  @UseGuards(WsGuards)
  @SubscribeMessage('createMessage')
  async handleMessage(client: CustomSocket, payload: CreateMessageDto) {
    const {_id} = client.user;
    const tempId = payload._id;
    delete payload._id;
    const response = await this.messageService.create(_id, payload);
    client.emit("sentMessageSuccess", {
      tempId: tempId,
      conversationId: payload.destination,
      message: response.data,
    });
    const destinationId = payload.destination;
    const message = response.data;
    message.destination = destinationId
    client.broadcast.to(destinationId).emit("newMessage", message);
  }
  @UseGuards(WsGuards)
  @SubscribeMessage('markReceiveMessage')
  async readMessage(client: CustomSocket, payload: string) {
    const response = (await this.messageService.receiveMessage(payload));
    const socket_id = await this.redisClient.get(response.data.sender._id);
    this.server.to(socket_id).emit("receivedMessage", {
      conversationId: response.data.destination._id,
      messageId: response.data._id,
    });
  }
}
