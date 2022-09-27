import { Inject, UseGuards } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import WsGuards from "./auth/ws-auth.guard";
import { ConversationService } from './conversation/conversation.service';
import { Observable } from 'rxjs';
import { User } from "./user/entities/user.entity";
import { RedisClientType } from '@redis/client';
import { Server } from "socket.io";
import CustomSocket from "./interfaces/CustomInterface";

@WebSocketGateway({
  cors:{
    origin: "*",
  }
})
@UseGuards(WsGuards)
export class ConversationGateway{
    @WebSocketServer()
    server: Server
    constructor(
        private readonly conversationService: ConversationService,
        @Inject("REDIS_CLIENT")
        private readonly redisClient: RedisClientType
    ){}
    @SubscribeMessage("createConversationFromFriendShip")
    async createConversationFromFriendShip(client: CustomSocket,@MessageBody()friendShipId: string){
        const response = await this.conversationService.createFromFriendship({friendShipId});
        const participants = response.data.participants as User[];
        const socketIds = await Promise.all(participants.map(async (participant) => {
            return await this.redisClient.get(participant._id);
        }))
        
        socketIds.forEach((socketId) => {
            this.server.to(socketId).emit("createConversationSuccess", response.data);
        })
    }
}