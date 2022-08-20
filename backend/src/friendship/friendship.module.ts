import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipService } from './friendship.service';
import { FriendShip } from './entities/friendship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendShip])],
  providers: [FriendshipService],
  exports: [FriendshipService]
})
export class FriendshipModule {}
