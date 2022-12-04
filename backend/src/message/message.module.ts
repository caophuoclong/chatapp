import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
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

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Conversation ,Member]), ConversationModule, UserModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService]
})
export class MessageModule {}
