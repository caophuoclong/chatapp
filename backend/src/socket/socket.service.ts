import { Inject, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { RedisClientType } from 'redis';
import { SocketEvent } from '~/constants/socketEvent';
export const roomConversation = (roomId: string)=> `conversation:${roomId}`
export const onlineUser = () => `online`
@Injectable()
export class SocketService {
    constructor(
        @Inject("REDIS_CLIENT")
        private readonly redisClient: RedisClientType
    ){}
    private socket: Server;
    get Socket(): Server {
        return this.socket;
    }
    set Socket(socket: Server) {
        this.socket = socket;
    }
/**
 * It takes a userId, an event name, and some data, and emits the event to the user with the given
 * userId
 * @param {string} userId - The userId of the user you want to send the event to.
 * @param {string} event - The event name.
 * @param {any} data - any - The data you want to send to the client.
 */
    async emitToUser(userId: string, event: string, data: any) {
        const socketId = await this.redisClient.hGet(onlineUser(), userId);
        if (this.socket) {
            this.socket.to(socketId).emit(event, data);
        }
    }
/**
 * It adds the socketId to the set of socketIds in the roomName
 * @param {string} socketId - The socket id of the user who is joining the room.
 * @param {string} roomName - The name of the room you want to join.
 */
    async joinRoom(socketId: string, roomName: string){
        await this.redisClient.sAdd(roomName, socketId);
    }
   /**
    * It removes a socket from a room.
    * @param {string} socketId - The socket id of the user who is leaving the room.
    * @param {string} roomName - The name of the room you want to leave.
    */
    async leaveRoom(socketId: string, roomName: string){
        await this.redisClient.sRem(roomName, socketId);
    }
/**
 * It emits an event to all sockets in a room except the sender
 * @param {string} roomName - The name of the room to emit to.
 * @param {string} event - the event name
 * @param {any} data - any - the data to be sent to the client
 * @param {string} socketId - The socket id of the sender.
 */
    async emitToRoomExcludeSener(roomName: string, event: string, data: any, senderId: string){
        const socketIds = await this.redisClient.sMembers(roomName);
        const socketId = await this.redisClient.hGet(onlineUser(), senderId);
        const socketIdsExcludeSender = socketIds.filter(id => id !== socketId);
        if(socketIdsExcludeSender.length === 0) return;
        this.socket.to(socketIdsExcludeSender).emit(event, data);
    }
/**
 * It takes a room name, an event name, and some data, and emits the event to all sockets in the room
 * @param {string} roomName - The name of the room you want to emit to.
 * @param {string} event - The event name
 * @param {any} data - any - The data you want to send to the client.
 */
    async emitToRoom(roomName: string, event: string, data: any){
        const socketIds = await this.redisClient.sMembers(roomName);
        this.socket.to(socketIds).emit(event, data);
    }
/**
 * It sets the user's socket id in the online user hash
 * @param {string} userId - The user's id
 * @param {string} socketId - The socket id of the user
 */
    async setUserOnline(userId: string, socketId: string){
        await this.redisClient.hSet(onlineUser(), userId, socketId);
    }
/**
 * It gets the socketId of a user from the onlineUser hash in Redis
 * @param {string} userId - The user's id
 * @returns The socketId of the user.
 */
    async getUserOnline(userId: string){
        const socketId = await this.redisClient.hGet(onlineUser(), userId);
        return socketId;
    }
/**
 * It deletes the userId from the onlineUser hash
 * @param {string} userId - The user's id
 */
    async setUserOffline(userId: string){
        await this.redisClient.hDel(onlineUser(), userId);
    }
 /**
  * It gets the socketId of the user from the redis hash, and if the socketId is found, it emits the
  * event to the socketId
  * @param {string} userId - The user's id
  * @param {string} event - The event name that the client will listen to.
  * @param {any} data - any: The data to be sent to the user.
  */
    async notifyToUser(userId: string, event: string, data: any): Promise<void>{
        const socketId = await this.redisClient.hGet(onlineUser(), userId);
        console.log(socketId);
        if (socketId) {
            this.socket.to(socketId).emit(event, data);
        }
    }
    /**
     * It checks if the token is valid, if not, it disconnects the client
     * @param {string} socketId - The socket id of the client that is connecting.
     * @param {string} authorization - The authorization header from the client.
     * @returns The token is being returned.
     */
    async  checkAuthorization(socketId: string, authorization: string){
    if (!authorization) {
        this.socket.emit(socketId, SocketEvent.INVALID_TOKEN, 'Token is invalid');
        const client = this.socket.sockets.sockets[socketId];
        client.disconnect();
    }
    const token = authorization.split(' ')[1];
    if (!token) {
        this.socket.emit(socketId, SocketEvent.INVALID_TOKEN, 'Token is invalid');
        this.socket.sockets.sockets[socketId].disconnect();
    }
    return token;
    }
}
