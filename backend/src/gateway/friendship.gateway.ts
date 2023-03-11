import { Inject, UseFilters, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RedisClientType } from "@redis/client";
import { Server } from "socket.io";
import { FriendshipService } from "../friendship/friendship.service";
import CustomSocket from "../interfaces/CustomInterface";
import WsGuards from '../auth/ws-auth.guard';
import { CatchWsException } from "~/exceptions/WsException";
@WebSocketGateway(
    {
        origin: "*"
    }
)
@UseFilters(new CatchWsException())
export class FriendShipGateway{
    @WebSocketServer()
    server: Server
    constructor(
        private readonly friendShipService: FriendshipService,
        @Inject("REDIS_CLIENT")
        private readonly redisClient: RedisClientType
    ){}
    @SubscribeMessage("testFriendShip")
    testSocket(client: CustomSocket, @MessageBody() body){
        console.log(body);
    }
    @SubscribeMessage("createFriendShip")
    async createFriendShip(@ConnectedSocket()client: CustomSocket, @MessageBody() userId: string){
        // const res_event_sender = "createFriendShipSuccess_sender"
        // const res_event_target = "createFriendShipSuccess_target"
        // const [response, socketId]  = await Promise.all([this.friendShipService.addFreiend(client.user._id, userId), this.redisClient.get(userId)])        
        // client.emit(res_event_sender, response.friendShip);
        // this.server.to(socketId).emit(res_event_target, response.friendShip);
    }
}