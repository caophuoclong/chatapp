import { createContext } from "react";
import * as io from "socket.io-client";
export const socket = io.connect("");
export const SocketContext = createContext({} as io.Socket);