import { CACHE_MANAGER, Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { AuthService } from './auth/auth.service';
import { JWTAuthGuard } from './auth/jwt-auth.guard';
import WsGuards from './auth/ws-auth.guard';
import CustomSocket from './interfaces/CustomInterface';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';
@WebSocketGateway(3001,{
  cors:{
    origin: "*",
  }
})
export class SocketGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ){}
  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.headers.authorization.split(" ")[1];
    if(token === "null"){
      this.disconect(client);
    }else{
    try{
      const {_id} = this.authService.verifyJWT(token);
      const user =( await this.userService.get(_id)).data;
      if(!user){
        this.disconect(client);
      }else{
      // let onlineUser = [];
      const onlineUser = await this.cacheManager.get<Array<String>>("online_user");
      const set = new Set(onlineUser);
      set.add(_id);
      const newOnlineUser = Array.from(set);
      const x = await this.cacheManager.set("online_user", newOnlineUser);
      console.log(x)
      this.cacheManager.get<Array<String>>("online_user").then(res => {
        console.log("🚀 ~ file: socket.gateway.ts ~ line 38 ~ SocketGateway ~ handleConnection ~ res", res)
      })
      const rooms = user.conversations;
      rooms.forEach(room => {
        this.crateRoom(client, room._id);
      })
        client.emit("connectSuccessFull", {
          message: "Hello"
        })
      }
    }catch(error){
      console.log(error);
      this.disconect(client);
    }
  }
}

  @UseGuards(WsGuards)
  @SubscribeMessage("disconnect")
  async handleDisconnect(client: CustomSocket) {
    const user = this.authService.verifyJWT(client.handshake.headers.authorization.split(" ")[1]);
    if(user){
      const {_id} = user;
      const onlineUser = await this.cacheManager.get<Array<String>>("online_user") || [];
      const set = new Set(onlineUser);
      set.delete(_id);
      const newOnlineUser = Array.from(set);
      await this.cacheManager.set("online_user", newOnlineUser);
      // leave on room which joined 
      const rooms = Object.keys(client.rooms);
      rooms.forEach(room => {
        this.leaveRoom(client, room);
      })
    }
      }
  private disconect(socket: Socket){
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect();
  }
  private crateRoom(socket: Socket, roomId: string){
    socket.join(roomId);
  }
  private leaveRoom(socket: Socket, roomId: string){
    socket.leave(roomId);
  }
}
