import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import {config} from "dotenv";
config();
@Module({
  imports: [
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
    ConfigModule,
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
