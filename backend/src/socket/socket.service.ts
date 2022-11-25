import { Inject, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { RedisClientType } from 'redis';
@Injectable()
export class SocketService {
    constructor(
        @Inject("REDIS_CLIENT")
        private readonly redisClient: RedisClientType
    ){}
    private socket: Server = null;
    get Socket(): Server {
        return this.socket;
    }
    set Socket(socket: Server) {
        this.socket = socket;
    }
    async emitToUser(userId: string, event: string, data: any) {
        const socketId = await this.redisClient.get(userId);
        if (this.socket) {
            this.socket.to(socketId).emit(event, data);
        }
    }
}
