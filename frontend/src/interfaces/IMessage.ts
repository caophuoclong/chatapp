import { IUser } from './IUser';
export enum MessageStatusType{
    SENT = "SENT",
    RECEIVED = "RECEIVED",
    SEEN = "SEEN",
    SENDING = "SENDING",

}
export interface IMessage{
    _id?: string,
    sender:IUser,
    content: string,
    createdAt: number,   
    isDeleted?: boolean,
    attachments: any,
    parentMessage: null | IMessage,
    status: MessageStatusType,
    destination: string,
}