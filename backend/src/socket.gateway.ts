import {
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { RedisClientType } from '@redis/client';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';
import WsGuards from './auth/ws-auth.guard';
import CustomSocket from './interfaces/CustomInterface';
import { MessageService } from './message/message.service';
import { UserService } from './user/user.service';
@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly messageServce: MessageService,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
  ) {}
  @WebSocketServer()
  server: Server;
  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.headers.authorization.split(' ')[1];
    if (token === 'null') {
      this.disconect(client);
    } else {
      try {
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
            this.crateRoom(client, room._id);
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
      } catch (error) {
        console.log(error);
        this.disconect(client);
      }
    }
  }

  @UseGuards(WsGuards)
  @SubscribeMessage('disconnect')
  async handleDisconnect(client: CustomSocket) {
    const user = this.authService.verifyJWT(
      client.handshake.headers.authorization.split(' ')[1],
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
  private disconect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
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
}
