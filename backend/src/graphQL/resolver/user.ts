import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { User } from "~/user/entities/user.entity";
import { UserService } from "~/user/user.service";
import { FriendShip } from '../../friendship/entities/friendship.entity';
import { Conversation } from '../../conversation/entities/conversation.entity';
import { UserDecorator } from "../decorator";
import { UseGuards } from "@nestjs/common";
import { JWTAuthGuard } from '../../auth/jwt-auth.guard';
import { GraphqlGuard } from '../../auth/graphql.guard';
import { Member } from '../../database/entities/member.entity';
import { MemberService } from "~/member/member.service";

@Resolver(of => User)
@UseGuards(GraphqlGuard)
export class UserResolver{
    constructor(
        private readonly userService: UserService,
        private readonly memberService: MemberService
    ){}
    @Query(()=> User, {name: "user"})
    findOneById(@Args("_id", {type: ()=> String}) _id: string){
         return this.userService.getOne({_id});
    }
    @Query(()=> User, {name: "getMe"})
    findOne(@UserDecorator() {username, _id}: {
        _id: string,
        username: string
    }){
        console.log("some one get them");
        
        return this.userService.getOne({_id});
    }
   
}
