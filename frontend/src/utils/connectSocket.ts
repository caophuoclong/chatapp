import { connect, Socket } from 'socket.io-client';
import LocalStorage from './localStorage';
export const connectSocket: (accessToken?: string) => Socket = (accessToken?: string) => {
  const ACCESS_TOKEN = LocalStorage.getAccessToken();
  const SERVER = process.env.REACT_APP_WS_URL || 'http://localhost:3003';
  return connect(SERVER, {
    extraHeaders: {
      Authorization: `Bearer ${accessToken || ACCESS_TOKEN}`,
      // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhODNjMDg4OS02M2E0LTQ4YjItODQwNC1mOGMwY2FiNDBjOWQiLCJ1c2VybmFtZSI6ImNhb3BodW9jbG9uZyIsImlhdCI6MTY2OTIwOTg0NiwiZXhwIjoxNjY5Mjk2MjQ2fQ.Tdnzdbhra1VaNFvNafHvOIzT0qD80snsF8PYUnlz_C4`
    },
  });
};
