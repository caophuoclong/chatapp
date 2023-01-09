import { Args, Query, Resolver } from "@nestjs/graphql";
import { Member } from '../../database/entities/member.entity';
import { MemberService } from "~/member/member.service";
import { User } from "~/user/entities/user.entity";
import { UserService } from "~/user/user.service";

@Resolver(of => Member)
export class MemberResolver{
    constructor(
        private readonly memberService: MemberService,
        private readonly userSerivce: UserService
    ){}
    // @Query(()=> [Member], {name: "members"})
    // getMembers(
    //     @Args(
    //     'userId', {type: ()=> String} ) userId: string){
    //         return this.userSerivce.getOne(userId);
    // }

}