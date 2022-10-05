import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipService } from './friendship.service';
import { FriendShip } from './entities/friendship.entity';
import { User } from '~/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendShip, User])],
  providers: [FriendshipService],
  exports: [FriendshipService]
})
export class FriendshipModule {}
