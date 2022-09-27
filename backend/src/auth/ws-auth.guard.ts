import { CanActivate, ExecutionContext, Inject, Injectable, HttpException } from '@nestjs/common';
import { AuthService } from "./auth.service";
@Injectable()
export default class WsGuards implements CanActivate{
    constructor(
        private readonly authService: AuthService,
    ) {}
    canActivate(context: ExecutionContext): boolean {
        const client = context.switchToWs().getClient();
        const token = client.handshake.headers.authorization;
        if(token){
            try{
                const {_id, username} = this.authService.verifyJWT(token.split(" ")[1]);
                context.switchToWs().getClient().user = {_id, username};
                return true;
            }catch(error){
                throw new HttpException("Invalid token", 401);
            }
            
        }
        return false;
    }
}