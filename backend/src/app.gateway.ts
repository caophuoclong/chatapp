import {
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { RedisClientType } from '@redis/client';
import { Observable } from 'rxjs';
import {  Server, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';
import WsGuards from './auth/ws-auth.guard';
import CustomSocket from './interfaces/CustomInterface';
import { MessageService } from './message/message.service';
import { SocketService } from './socket/socket.service';
import { UserService } from './user/user.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly messageServce: MessageService,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
    private socketService: SocketService
  ) {}
  @WebSocketServer()
  server: Server;
  afterInit(server: Server) {
    this.socketService.Socket =  server;
  }
  @SubscribeMessage("authenticate")
  async authenticateSocket(client: CustomSocket){
      console.log("some one is connecting");
      const authorization = client.handshake.headers.authorization;
      if(!authorization){
        // console.log("Could not recevie authorization");
        client.emit("invalidToken", "Token is invalid");
        this.disconect(client);
      }
      const token = client.handshake.headers.authorization.split(' ')[1];
      if(!token){
        client.emit("invalidToken", "Token is invalid");
        this.disconect(client);
      }
      try{
        const { _id } = this.authService.verifyJWT(token);
        const user = (await this.userService.get(_id)).data;
        const listFriend = (await this.userService.getListFriend(_id)).data;
        if (listFriend)
          listFriend.forEach(async (friend) => {
            if (friend.statusCode.code === 'a') {
              await this.NotiToMyFriendOnline(_id, friend.user._id);
            }
          });
        if (!user) {
          this.disconect(client);
        } else {
          await this.updateStatusUser(_id, client, 'ONLINE');
          await this.userService.updateLastOnline(_id, 'ONLINE');
          const rooms = user.conversations;
          rooms.forEach((room) => {
            this.crateRoom(client, room.conversationId);
          });
          const readMessage = await this.messageServce.markAsReceived(_id);
          if (readMessage.statusCode === 200) {
            const { data } = readMessage;
            for (let i = 0; i < data.length; i++) {
              const socket_id = await this.redisClient.get(data[i].senderId);
              if (socket_id) {
                this.server.to(socket_id).emit('receivedMessage', {
                  conversationId: data[i].conversationId,
                  messageId: data[i].messageId,
                });
              }
            }
          }
        }
        console.log("connected");
        
      }catch(error){
        client.emit("somethingWrong");
      }
  }
  async handleConnection(client: CustomSocket) {
    // console.log("some one connect");
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(client: CustomSocket) {
    const authorization = client.handshake.headers.authorization;
    if(!authorization){
      console.log("could not receive authorization");
      return;
    }
    const token = authorization.split(" ")[1];
    if(!token){
      client.emit("invalidToken","Token is invalid!")
    }
    try{
    const user = this.authService.verifyJWT(
    token
    );
    if (user) {
      const { _id } = user;
      await this.updateStatusUser(_id, client, 'OFFLINE');
      await this.userService.updateLastOnline(_id, 'OFFLINE');
      const listFriend = (await this.userService.getListFriend(_id)).data;
      if (listFriend)
        listFriend.forEach(async (friend) => {
          if (friend.statusCode.code === 'a') {
            await this.NotiToMyFriendOffline(_id, friend.user._id);
          }
        });
      const rooms = Object.keys(client.rooms);
      rooms.forEach((room) => {
        this.leaveRoom(client, room);
      });
    }
    }
    catch(error){
      client.emit("refreshToken")
    }
  }
  private disconect(socket: Socket) {
    socket.disconnect();
  }
  private crateRoom(socket: Socket, roomId: string) {
    socket.join(roomId);
  }
  private leaveRoom(socket: Socket, roomId: string) {
    socket.leave(roomId);
  }
  private async updateStatusUser(
    _id: string,
    client: Socket,
    status: 'ONLINE' | 'OFFLINE',
  ) {
    if (status === 'ONLINE') await this.redisClient.set(_id, client.id);
    else await this.redisClient.del(_id);
  }
  private async NotiToMyFriendOnline(_id: string, friendId: string) {
    const socketId = await this.redisClient.get(friendId);
    if (socketId) {
      this.server.to(socketId).emit('MY_FRIEND_ONLINE', _id);
    }
  }
  private async NotiToMyFriendOffline(_id: string, friendId: string) {
    const socketId = await this.redisClient.get(friendId);
    if (socketId) {
      this.server.to(socketId).emit('MY_FRIEND_OFFLINE', {
        _id,
        lastOnline: Date.now(),
      });
    }
  }
     @SubscribeMessage("leaveRoom")
    async (@ConnectedSocket() client: CustomSocket, @MessageBody() conversationId: string){
        console.log("🚀 ~ file: conversation.gateway.ts ~ line 39 ~ ConversationGateway ~ leaveRoom ~ conversationId", conversationId)
        client.leave(conversationId);
    }
  @SubscribeMessage("joinRoom")
  handleJoinRoom(@ConnectedSocket()client: CustomSocket,@MessageBody() roomId){
    client.join(roomId);
  }
}
