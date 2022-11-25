import { FriendShip } from "~/friendship/entities/friendship.entity";
import { User } from "~/user/entities/user.entity";

export interface IListFriend extends Omit<FriendShip, "userRequest" | "userAddress"> {
    user: User
}