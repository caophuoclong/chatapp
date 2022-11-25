import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import CustomSocket from '~/interfaces/CustomInterface';
@Catch(WsException)
export class CatchWsException  implements ExceptionFilter{
    catch(exception: WsException, host: ArgumentsHost) {
        console.log("Catch ws exception");
        const error = exception.getError();
        const client = host.switchToWs().getClient() as CustomSocket;
        const ws = host.switchToWs();
        const data = ws.getData();
        
        // console.log(client.handshake);
        console.log(client.request);
        
        switch(error){
            case "refreshToken":
                console.log("Must refresh token");
                client.emit("refreshToken", client.data);
                // client.disconnect();
                break;
            default:
                console.log("Error in ws guards")
        }
    }
}