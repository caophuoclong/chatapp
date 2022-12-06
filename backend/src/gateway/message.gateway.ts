import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server } from 'socket.io';
import WsGuards from '../auth/ws-auth.guard';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import { ConversationService } from '../conversation/conversation.service';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import CustomSocket from '../interfaces/CustomInterface';
import { Message, MessageStatusType } from '../message/entities/message.entity';
import { RedisClientType } from 'redis';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../database/entities/member.entity';
import { Repository } from 'typeorm';
import { CatchWsException } from '~/exceptions/WsException';

@WebSocketGateway({
  cors:{
    origin: "*",
  }
})
@UseFilters(new CatchWsException())
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
    // check if any user online
    const destinationId = payload.destination;
    const members = await this.memberRepository.find({
      where:{
        conversationId: destinationId
      }
    });
    const participants = await this.conversationService.getUserOfConversation(destinationId);
    const participantsId = participants.data.map((participant) => participant._id);
    // check if any participants Id have a socket in redis
    const onlineParticipants = await this.redisClient.mGet(participantsId);
    const mySocketId = await this.redisClient.get(_id);
    // get diff id
    const diff = onlineParticipants.filter((socketId) => socketId !== mySocketId);
    // check array have any  string diff null return boolean
    const isOnline = diff.some((socketId) => socketId !== null && socketId !== "null");
    let me = response.data as Message;

    if(isOnline){
      me.status = MessageStatusType.RECEIVED;
    }
    console.log(me);

    client.emit("sentMessageSuccess", {
      tempId: tempId,
      conversationId: destinationId,
      message: me,
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
    await this.memberRepository.save(members);
    const message = response.data;
    message.destination = payload.destination;
    client.broadcast.to(destinationId).emit("newMessage", {
      ...message,
      updateAt: payload.updateAt
    });
      Promise.all(ids.map((id)=>{
      return new Promise(async (resolve, reject)=>{
        const socketId = await this.redisClient.get(id);
        if(socketId){
          this.server.to(socketId).emit("queryAgainConversation", {
            conversationId: payload.destination,
            message: message
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
