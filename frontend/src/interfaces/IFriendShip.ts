import { IUser } from './IUser';
export default interface IFriendShip {
    friendShipId: number;
    statusCode:{
        code: "a" | "r" | "p" | "b",
        name: "Accepted" | "Rejected" | "Pending" | "Blocked",
    },
    user: IUser
}