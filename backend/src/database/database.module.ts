import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from '~/attachment/entities/attachment.entity';
import { Conversation } from '~/conversation/entities/conversation.entity';
import { Confirmation } from '~/database/entities/confirmation.entity';
import { Emoji } from '~/database/entities/Emoji';
import { Member } from '~/database/entities/member.entity';
import { PasswordResetToken } from '~/database/entities/passResetToken.entity';
import { Status } from '~/database/entities/status.entity';
import { FriendShip } from '~/friendship/entities/friendship.entity';
import { Message } from '~/message/entities/message.entity';
import { UnRead } from '~/unread/entities/unread.entity';
import { User } from '~/user/entities/user.entity';
import { Assets } from './entities/assets.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get("database_host"),
          port: configService.get<number>("database_port"),
          username: configService.get("database_user"),
          password: configService.get("database_password"),
          database: configService.get("database_database"),
          entities: [
            User,
            Status,
            FriendShip,
            Conversation,
            Message,
            UnRead,
            PasswordResetToken,
            Confirmation,
            Emoji,
            Member,
            Assets
          ],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    
    }),
    ]
})
export class DatabaseModule {}
