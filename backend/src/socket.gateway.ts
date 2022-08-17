import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(3001, {
  cors: {
    origin: "*"
  }
})
export class SocketGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
  handleConnection(client: any) {
    client.emit('message', 'Hello world!');
    console.log('New client connected');
  }
}
