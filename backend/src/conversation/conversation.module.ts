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
import { SocketModule } from '~/socket/socket.module';
import { Emoji } from '~/database/entities/Emoji';
import { Member } from '~/database/entities/member.entity';
import { ConversationSocket } from './conversation.socket';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FriendShip, Conversation, Emoji, Member]),
    forwardRef(()=> UserModule),
    FriendshipModule,
    SocketModule
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationSocket],
  exports: [ConversationService]
})
export class ConversationModule {}
