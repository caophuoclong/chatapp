import { Socket, connect } from 'socket.io-client';
import localStorage from '~/utils/localStorage';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3003';
const ACCESS_TOKEN = localStorage.getAccessToken();
export class AppSocket {
  private static socket: Socket | null;
  private constructor() {}
  public static getInstance() {
    if (!AppSocket.socket ) {
      AppSocket.socket = connect(SERVER_URL, {
        extraHeaders: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
    }
    return AppSocket.socket;
  }
}