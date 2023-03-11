import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { AttachmentModule } from '../attachment/attachment.module';
import { ConversationModule } from '~/conversation/conversation.module';
import { User } from '~/user/entities/user.entity';
import { Conversation } from '~/conversation/entities/conversation.entity';
import { Attachment } from '../attachment/entities/attachment.entity';
import { UserModule } from '../user/user.module';
import { Member } from '~/database/entities/member.entity';
import { SocketModule } from '../socket/socket.module';
import { MessageSocket } from './message.socket';
import { MessageResolver } from '~/graphQL/resolver/message';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Conversation ,Member]), 
    forwardRef(()=>ConversationModule), 
    forwardRef(()=> UserModule)
    , SocketModule
  ],
  controllers: [MessageController],
  providers: [MessageResolver,MessageService,MessageSocket],
  exports: [MessageService]
})
export class MessageModule {}
