import { IUser } from './IUser';
export interface IMessage{
    _id: string,
    sender:IUser,
    content: string,
    createdAt: number,   
    isDeleted: boolean,
}