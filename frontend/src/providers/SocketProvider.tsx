import React from 'react';
import * as io from 'socket.io-client';
import { SocketContext } from '../context/SocketContext';

type Props = { children: React.ReactNode };

export default function SocketProvider({ children }: Props) {
  const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3004';
  const s = io.connect(WS_URL);
  return <SocketContext.Provider value={s}>{children}</SocketContext.Provider>;
}
