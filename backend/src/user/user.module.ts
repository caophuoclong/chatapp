import { Module, NestModule, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import Utils from '~/utils';
import { IUtils1 } from '~/interfaces/IUtils';
import { FriendshipService } from '~/friendship/friendship.service';
import { FriendshipModule } from '../friendship/friendship.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '~/auth/local.strategy';
import { AuthService } from '~/auth/auth.service';
import { AuthModule } from '~/auth/auth.module';
import { ConversationModule } from '../conversation/conversation.module';
import { PasswordResetToken } from '../entities/passResetToken.entity';
import { RedisModule } from '~/redis.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordResetToken]),
    FriendshipModule,
    forwardRef(() => ConversationModule),
    RedisModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUtils',
      useClass: Utils,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
