import React, { useEffect } from 'react';
import * as io from 'socket.io-client';
import { useAppDispatch } from '~/app/hooks';
import { updateLastestMessage } from '~/app/slices/conversations.slice';
import { setSocket } from '~/app/slices/global.slice';
import { addMessage } from '~/app/slices/messages.slice';
import { SocketContext } from '../context/SocketContext';

type Props = { children: React.ReactNode };
export const connectSocket = () => {
  const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3004';
  const access_token = localStorage.getItem('access_token');
  const s = io.connect(WS_URL, {
    extraHeaders: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return s;
};
export default function SocketProvider({ children }: Props) {
  const dispatch = useAppDispatch();
  const s = connectSocket();
  useEffect(() => {
    dispatch(setSocket(s));
  }, [s]);
  s.on('connection', (data) => {});
  s.on('newMessage', (data) => {
    console.log(data);
    const { destination, ...message } = data;
    dispatch(
      addMessage({
        message: message,
        conversationId: destination,
      })
    );
    dispatch(
      updateLastestMessage({
        message: message,
        conversationId: destination,
      })
    );
  });
  s.on('connectSuccessFull', (data) => {
    console.log(data);
  });

  return <SocketContext.Provider value={s}>{children}</SocketContext.Provider>;
}
