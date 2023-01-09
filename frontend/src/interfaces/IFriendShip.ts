import { IUser } from './IUser';
export type code = "a" | "r" | "p" | "b";
export type codeName = "Accept" | "Reject" | "Pending" | "Blocked";
export interface status{
    code: code,
    name: codeName,
}
export default interface IFriendShip {
    _id: string;
    status:status,
    user: IUser,
    flag: "sender" | "target"
}