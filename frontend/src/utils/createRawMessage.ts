import { IMessage, MessageStatusType, MessageType } from "~/interfaces/IMessage";
import randomInt from "./randomInt";
import { IUser } from '../interfaces/IUser';

 export  const createRawMessage = (
    type: MessageType,
    content: string,
    sender: IUser,
    destination: string,
    createdAt?: number,

  ) => {
    const message: IMessage = {
      _id: (Date.now() + randomInt(0, 9999)).toString(),
      destination,
      parentMessage: null,
      status: MessageStatusType.SENDING,
      sender,
      content,
      type: type,
      isRecall: false,
      createdAt: createdAt || Date.now(),
    };
    return message;
  };