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
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';

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
    private readonly redisClient: RedisClientType,
    @InjectRepository(Member)
    private readonly memberRepository : Repository<Member>
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
    const members = await this.memberRepository.find({
      where:{
        conversationId: payload.destination
      }
    });
    const ids = [];
    members.forEach((m)=>{
      return m.userId !== response.data.sender._id && m.isDeleted && !m.isBlocked ?(()=>{
        ids.push(m.userId);
        m.isDeleted = false;
        m.deletedAt = 0;
        m.createdAt = new Date().getTime() - 15 * 1000;
      })():m
    })
    // Notify user to create again conversation;
    // get socket id;
    await this.memberRepository.save(members);
    const message = response.data;
    message.destination = payload.destination;
    console.log(message);
    client.broadcast.to(destinationId).emit("newMessage", {
      ...message,
      updateAt: payload.updateAt
    });
      Promise.all(ids.map((id)=>{
      return new Promise(async (resolve, reject)=>{
        const socketId = await this.redisClient.get(id);
        if(socketId){
          this.server.to(socketId).emit("queryAgainConversation", {
            conversationId: payload.destination
          })
        }
      })
    }))
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
  @UseGuards(WsGuards)
    @SubscribeMessage("recallMessage")
    async recallMessage(client: CustomSocket, payload: {
      conversationId: string,
      messageId: string,
    }){
      const response = await this.messageService.recallMessage(payload.messageId);
      if(response.statusCode === 200)      {
        this.server.to(payload.conversationId).emit("messageHasBeenRecalled", {messageId: payload.messageId, conversationId: payload.conversationId});
      }
    }
}
