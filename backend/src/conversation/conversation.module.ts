import { forwardRef, Inject, Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FriendShip } from '../friendship/entities/friendship.entity';
import { UserModule } from '../user/user.module';
import { FriendshipModule } from '../friendship/friendship.module';
import { Conversation } from './entities/conversation.entity';
import { UserService } from '~/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FriendShip, Conversation]),
    forwardRef(()=> UserModule),
    FriendshipModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService]
})
export class ConversationModule {}
