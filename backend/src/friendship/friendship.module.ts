import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipService } from './friendship.service';
import { FriendShip } from './entities/friendship.entity';
import { User } from '~/user/entities/user.entity';
import { SocketModule } from '~/socket/socket.module';
import { FriendsResolver } from '~/graphQL/resolver/friends';

@Module({
  imports: [
    
    TypeOrmModule.forFeature([FriendShip, User]), SocketModule],
  providers: [FriendsResolver,FriendshipService],
  exports: [FriendshipService]
})
export class FriendshipModule {}
