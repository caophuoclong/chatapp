import { CanActivate, ExecutionContext, Inject, Injectable, HttpException, UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from "./auth.service";
import { SocketService } from '../socket/socket.service';
import CustomSocket from '~/interfaces/CustomInterface';
@Injectable()
export default class WsGuards implements CanActivate {
    constructor(
        private readonly authService: AuthService,
    ) {
    }
    canActivate(context: ExecutionContext): boolean {
        // console.log(this.socketService)
        const client = context.switchToWs().getClient() as CustomSocket;
        const authorization = client.handshake.headers.authorization;
        if(authorization){
            try{
                const token = authorization.split(" ")[1];
                const {_id, username} = this.authService.verifyJWT(token);
                console.log(token);
                context.switchToWs().getClient().user = {_id, username};
                return true;
            }catch(error){
                throw new WsException("refreshToken");
            }
        }
        return false;
    }
}