import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { appConfig, config, databaseConfig, mailConfig } from './configs';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { AuthService } from './auth/auth.service';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { Status } from './database/entities/status.entity';
import { FriendShip } from './friendship/entities/friendship.entity';
import { Conversation } from './conversation/entities/conversation.entity';
import { Message } from './message/entities/message.entity';
import { FriendshipModule } from './friendship/friendship.module';
import { UnRead } from './unread/entities/unread.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { Attachment } from './attachment/entities/attachment.entity';
import { redisConfig } from './configs/index';
import { PasswordResetToken } from './database/entities/passResetToken.entity';
import { RedisModule } from './redis.module';
import { SocketModule } from './socket/socket.module';
import { MailModule } from './mail/mail.module';
import { Confirmation } from './database/entities/confirmation.entity';
import { Emoji } from './database/entities/Emoji';
import { Member } from './database/entities/member.entity';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { GatewayModule } from './gateway/gateway.module';
import { AppGateway } from './app.gateway';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MemberModule } from './member/member.module';
import { FriendshipController } from "./friendship/friendship.controller";
import process from 'process';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>(
      {
        cache: "bounded",
        context: ({req})=>({req}),
        driver: ApolloDriver,
        autoSchemaFile: join(process.cwd(), "/src/graphQL/schema/schema.gql"),
        playground: true
      }
    ),
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, config, redisConfig, mailConfig, appConfig],
    }),
    DatabaseModule,
    UserModule,
    MessageModule,
    ConversationModule,
    FriendshipModule,
    MessageModule,
    SocketModule,
    MailModule,
    AuthModule,
    TypeOrmModule.forFeature([Member]),
    GatewayModule,
    MemberModule,
  ],
  controllers: [AppController, FriendshipController],
  providers: [ AppGateway],
})
export class AppModule {}
