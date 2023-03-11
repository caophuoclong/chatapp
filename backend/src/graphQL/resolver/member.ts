import { Args, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from '~/member/member.service';
import { User } from '~/user/entities/user.entity';
import { UserService } from '~/user/user.service';
import { JWTAuthGuard } from '../../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Member } from '~/database/entities/member.entity';
import { GraphqlGuard } from '../../auth/graphql.guard';

@Resolver((of) => Member)
@UseGuards(GraphqlGuard)
export class MemberResolver {
  constructor(private readonly memberService: MemberService, private readonly userSerivce: UserService) {}
  @Query(() => Member, { name: 'memberDetails' })
  async memberDetails(
    @Args('userId', { type: ()=>String }) userId: string,
    @Args('conversationId', { type: ()=>String }) conversationId: string,
  ) {
    const response = await this.memberService.getOne({ _id: userId }, { _id: conversationId });
    const { conversation, conversationId: co, user, userId: ui, ...result } = response;
    return result;
  }
  // @Query(()=> [Member], {name: "members"})
  // getMembers(
  //     @Args(
  //     'userId', {type: ()=> String} ) userId: string){
  //         return this.userSerivce.getOne(userId);
  // }
}
