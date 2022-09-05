import React, { useEffect } from 'react';
import * as io from 'socket.io-client';
import { useAppDispatch } from '~/app/hooks';
import { setSocket } from '~/app/slices/global.slice';
import { SocketContext } from '../context/SocketContext';

type Props = { children: React.ReactNode };

export default function SocketProvider({ children }: Props) {
  const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3004';
  const access_token = localStorage.getItem('access_token');
  const s = io.connect(WS_URL, {
    extraHeaders: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setSocket(s));
  }, [s]);
  s.on('connection', (data) => {});

  return <SocketContext.Provider value={s}>{children}</SocketContext.Provider>;
}
