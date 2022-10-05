import { Inject, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
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
    async createConversationFromFriendShip(@ConnectedSocket() client: CustomSocket,@MessageBody()friendShipId: string){
        const response = await this.conversationService.createFromFriendship({friendShipId});
        const participants = response.data.participants as User[];
        const socketIds = await Promise.all(participants.filter(pa => pa._id !== client.user._id).map(async (participant) => {
            return await this.redisClient.get(participant._id);
        }))
        client.emit("u_created_conversation", response.data);
        socketIds.forEach((socketId) => {
            this.server.to(socketId).emit("createConversationSuccess", response.data);
        })
    }
}