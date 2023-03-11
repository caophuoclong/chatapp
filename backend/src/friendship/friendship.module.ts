import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipService } from './friendship.service';
import { FriendShip } from './entities/friendship.entity';
import { User } from '~/user/entities/user.entity';
import { SocketModule } from '~/socket/socket.module';
import { FriendsResolver } from '~/graphQL/resolver/friends';
import { FriendshipController } from './friendship.controller';

@Module({
  imports: [
    
    TypeOrmModule.forFeature([FriendShip, User]), SocketModule],
  providers: [FriendsResolver,FriendshipService],
  exports: [FriendshipService],
  controllers: [FriendshipController]
})
export class FriendshipModule {}
