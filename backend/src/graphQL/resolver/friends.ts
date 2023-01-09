import { Resolver } from "@nestjs/graphql";
import { FriendShip } from '../../friendship/entities/friendship.entity';
import { FriendshipService } from "~/friendship/friendship.service";

@Resolver(of => FriendShip)
export class FriendsResolver{
    constructor(
        private readonly friendService: FriendshipService
    ){}
}