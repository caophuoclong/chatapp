import { PassportModule } from '@nestjs/passport';
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { Status } from './entities/status.entity';
import { FriendShip } from './friendship/entities/friendship.entity';
import { Conversation } from './conversation/entities/conversation.entity';
import { Message } from './message/entities/message.entity';
import { FriendshipModule } from './friendship/friendship.module';
import { AttachmentModule } from './attachment/attachment.module';
import { UnreadModule } from './unread/unread.module';
import { UnRead } from './unread/entities/unread.entity';
import { AuthvalidationMiddleware } from './authvalidation.middleware';
import { LocalStrategy } from '~/auth/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { Attachment } from './attachment/entities/attachment.entity';
import { TestModule } from './test/test.module';
import { MessageGateway } from './message.gateway';
import * as redisStore from 'cache-manager-redis-store';
import { redisConfig } from './configs/index';
import { PasswordResetToken } from './entities/passResetToken.entity';
import { RedisModule } from './redis.module';
import { FriendShipGateway } from './friendship.gateway';
import { SocketModule } from './socket/socket.module';
import { AppGateway } from './app.gateway';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { Confirmation } from './entities/confirmation.entity';
import { Emoji } from './entities/Emoji';
import { Member } from './entities/member.entity';



@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, config, redisConfig, mailConfig, appConfig],
    }),
    
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const config = databaseConfig();
        return {
          type: 'mysql',
          host: config.database_host,
          port: +config.database_port,
          username: config.database_user,
          password: config.database_password,
          database: config.database_database,
          entities: [
            User,
            Status,
            FriendShip,
            Conversation,
            Message,
            UnRead,
            Attachment,
            PasswordResetToken,
            Confirmation,
            Emoji,
            Member
          ],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    
    }),
    UserModule,
    MessageModule,
    ConversationModule,
    AttachmentModule,
    PassportModule,
    FriendshipModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: config().jwtSecret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    MessageModule,
    SocketModule,
    MailModule,
    TypeOrmModule.forFeature([Member])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    MessageGateway,
    FriendShipGateway,
    AppGateway

  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //   .apply(AuthvalidationMiddleware)
  //   .exclude("/api/user/login", "/api/user/register")
  //   .forRoutes("*")
  // }
}
