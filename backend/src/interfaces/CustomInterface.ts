import { Socket } from "socket.io";

export default interface CustomSocket extends Socket{
    user:{
        _id: string,
        username: string,
    }
}