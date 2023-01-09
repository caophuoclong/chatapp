import { IMessage } from './IMessage';
import { IUser } from './IUser';
import IFriendShip from './IFriendShip';
export type ConversationType = 'group' | 'direct';
export interface IEmoji {
  _id: string;
  userId: string;
  emoji: string;
  skinTon: string;
}
export default interface IConversation {
  _id: string;
  name: string;
  avatarUrl: string;
  isBlocked: boolean;
  createdAt: Date;
  participants: Array<IUser>;
  lastMessage: IMessage;
  type: ConversationType;
  friendship?: IFriendShip;
  owner: IUser;
  updateAt: number;
  emoji?: IEmoji;
}
