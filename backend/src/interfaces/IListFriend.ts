import { FriendShip } from "~/friendship/entities/friendship.entity";
import { User } from "~/user/entities/user.entity";
import { Status } from '~/database/entities/status.entity';

export interface IListFriend extends Omit<FriendShip, "userRequest" | "userAddress"> {
    user: User
}
export interface filteredFriendships{
      _id: string,
      user: User,
      status: Status,
      flag: "sender" | "target"
    }