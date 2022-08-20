import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import Utils from '~/utils';
import { IUtils1 } from '~/interfaces/IUtils';
import { FriendshipService } from '~/friendship/friendship.service';
import { FriendshipModule } from '../friendship/friendship.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), FriendshipModule],
  controllers: [UserController],
  providers: [UserService, {
    provide: "IUtils",
    useClass: Utils,
  }]
})
export class UserModule {}
