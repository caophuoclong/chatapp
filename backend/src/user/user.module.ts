import { Module, NestModule, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import Utils from '~/utils';
import { FriendshipModule } from '../friendship/friendship.module';
import { ConversationModule } from '../conversation/conversation.module';
import { PasswordResetToken } from '../database/entities/passResetToken.entity';
import { RedisModule } from '~/redis.module';
import { MailModule } from '../mail/mail.module';
import { Confirmation } from '~/database/entities/confirmation.entity';
import { Emoji } from '~/database/entities/Emoji';
import { Member } from '~/database/entities/member.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordResetToken, Confirmation, Emoji, Member]),
    FriendshipModule,
    forwardRef(() => ConversationModule),
    RedisModule,
    MailModule
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
