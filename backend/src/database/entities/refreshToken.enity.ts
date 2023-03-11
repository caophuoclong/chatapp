import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class RefreshToken {
  @Field()
  userId: string;
  @Field()
  token: string;
  @Field()
  expired_time: number;
}
export default RefreshToken;