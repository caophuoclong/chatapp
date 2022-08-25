import { IUser } from './IUser';
export type code = "a" | "r" | "p" | "b";
export type codeName = "Accept" | "Reject" | "Pending" | "Blocked";
export interface StatusCode{
    code: code,
    name: codeName,
}
export default interface IFriendShip {
    friendShipId: string;
    statusCode:StatusCode,
    user: IUser,
    flag: "sender" | "target"
}