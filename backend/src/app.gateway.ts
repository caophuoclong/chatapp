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
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';
import WsGuards from './auth/ws-auth.guard';
import { SocketEvent } from './constants/socketEvent';
import CustomSocket from './interfaces/CustomInterface';
import { MessageService } from './message/message.service';
import { roomConversation, SocketService } from './socket/socket.service';
import { UserService } from './user/user.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly messageServce: MessageService,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
    private socketService: SocketService,
  ) {}
  @WebSocketServer()
  server: Server;
  afterInit(server: Server) {
    this.socketService.Socket = server;
  }
  @SubscribeMessage(SocketEvent.AUTHENTICATE)
  async authenticateSocket(client: CustomSocket) {
    const token = await this.socketService.checkAuthorization(client.id, client.handshake.headers.authorization);
    try {
      const { _id } = this.authService.verifyJWT(token);
      const user = (await this.userService.get(_id)).data;
      if (!user) {
        this.disconect(client);
      } else {
      const listFriend = (await this.userService.getListFriend(_id));
      if (listFriend)
        listFriend.forEach(async (friend) => {
          if (friend.status.code === 'a') {
            this.NotiToMyFriendOnline(_id, friend.user._id);
          }
        });
        this.updateStatusUser(_id, client.id, 'ONLINE');
        this.userService.updateLastOnline(_id, 'ONLINE');
        const conversations =  (await this.userService.getListConversations(user._id));
        conversations.forEach((conversation) => {
          this.socketService.joinRoom(
            client.id,
            roomConversation(conversation._id),
          );
        });
         await this.messageServce.markAsReceived(_id);
        // if (readMessage.status === 200) {
        //   const { data } = readMessage;
        //   for (let i = 0; i < data.length; i++) {
        //     const socket_id = await this.redisClient.get(data[i].senderId);
        //     if (socket_id) {
        //       this.server.to(socket_id).emit(SocketEvent.RECEIVE_MESSAGE, {
        //         conversationId: data[i].conversationId,
        //         messageId: data[i].messageId,
        //       });
        //     }
        //   }
        // }
      }
      console.log('connected');
    } catch (error) {
      client.emit(SocketEvent.SOMETHING_WENT_WRONG);
    }
  }
  async handleConnection(client: CustomSocket) {
    // console.log("some one connect");
  }

  @SubscribeMessage(SocketEvent.DISCONNECT)
  async handleDisconnect(client: CustomSocket) {
    const authorization = client.handshake.headers.authorization;
   const token = await this.socketService.checkAuthorization(client.id, authorization);
    try {
      const user = this.authService.verifyJWT(token);
      if (user) {
        const { _id } = user;
        await this.updateStatusUser(_id, client.id, 'OFFLINE');
        await this.userService.updateLastOnline(_id, 'OFFLINE');
        const listFriend = (await this.userService.getListFriend(_id));
        const conversations = (await this.userService.getListConversations(_id));
        if (listFriend)
          listFriend.forEach(async (friend) => {
            if (friend.status.code === 'a') {
              await this.NotiToMyFriendOffline(_id, friend.user._id);
            }
          });
        conversations.forEach((conversation) => {
          this.socketService.leaveRoom(client.id, roomConversation(conversation._id));
        });
      }
    } catch (error) {
      client.emit(SocketEvent.REFRESH_TOKEN);
    }
  }
  private disconect(socket: Socket) {
    socket.disconnect();
  }
  private async updateStatusUser(
    _id: string,
    socketId: string,
    status: 'ONLINE' | 'OFFLINE',
  ) {
    if (status === 'ONLINE')
      await this.socketService.setUserOnline(_id, socketId);
      else await this.socketService.setUserOffline(_id);
  }
  private async NotiToMyFriendOnline(_id: string, friendId: string) {
    await this.socketService.notifyToUser(friendId, SocketEvent.ONLINE, _id )
  }
  private async NotiToMyFriendOffline(_id: string, friendId: string) {
    await this.socketService.notifyToUser(friendId, SocketEvent.OFFLINE, {
      _id,
      lastOnline: Date.now()
    } )
  }
  @SubscribeMessage(SocketEvent.LEAVE_CONVERSATION)
  async(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() conversationId: string,
  ) {
    this.socketService.leaveRoom(client.id, roomConversation(conversationId));
  }
  @SubscribeMessage(SocketEvent.JOIN_CONVERSATION)
  handleJoinRoom(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() conversationId: string,
  ) {
    this.socketService.joinRoom(client.id, roomConversation(conversationId));
  }
}
