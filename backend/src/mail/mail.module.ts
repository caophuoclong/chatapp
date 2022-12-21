import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import {config} from "dotenv";
config();
@Module({
  imports: [
    SendGridModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apikey: configService.get('SENDGRID_API_KEY'),
      })
    })
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
