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
import { ConversationResolver } from '~/graphQL/resolver/conversation';
import { MemberModule } from '~/member/member.module';
import { MessageModule } from '~/message/message.module';
import { AuthModule } from '~/auth/auth.module';

@Module({
  imports: [
        forwardRef(()=> AuthModule),

    TypeOrmModule.forFeature([User, FriendShip, Conversation, Emoji, Member]),
    forwardRef(() => UserModule),
    forwardRef(() => MemberModule),
    forwardRef(() => MessageModule),
    FriendshipModule,
    SocketModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationResolver, ConversationService, ConversationSocket],
  exports: [ConversationService],
})
export class ConversationModule {}
