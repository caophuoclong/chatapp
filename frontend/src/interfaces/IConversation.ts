import { IMessage } from './IMessage';
import { IUser } from './IUser';
import IFriendShip from './IFriendShip';
export default interface IConversation{
    _id: string,
    name: string;
    avatarUrl: string;
    isBlocked: boolean,
    createdAt: Date,
    participants: Array<IUser>,
    lastMessage: IMessage,
    type: "group" | "direct"
    friendship: IFriendShip
}