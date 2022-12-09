import { Injectable } from "@nestjs/common";
import { SocketService } from "~/socket/socket.service";

@Injectable()
export class ConversationSocket{
    constructor(
        private readonly socketService: SocketService
    ){}
}