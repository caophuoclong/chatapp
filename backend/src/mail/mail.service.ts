import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '~/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { IMail, mailBody, mailSubject } from './constant';

@Injectable()
export class MailService {
  constructor(private mailerService: SendGridService, private readonly configService: ConfigService) {}

  async sendUserConfirmation(user: User, token: string, lan: 'en' | 'vn') {
    const subject = 'confirmation';

    const url = `${this.configService.get('client_host')}/auth/confirm?token=${token}&lan=${lan}`;
    try {
      return await this.mailerService.send(
        this.msg(
          user.email,
          subject,
          {
            name: user.name,
            url,
            index: subject,
          },
          lan,
        ),
      );
    } catch (error) {
      console.log('mailservice 35', error);
    }
  }
  async sendMailRecovery(user: User, url: string, lan: 'en' | 'vn') {
    const subject = 'recoveryPassword';
    try {
      return await this.mailerService.send(
        this.msg(
          user.email,
          subject,
          {
            name: user.name,
            url,
            index: subject,
          },
          lan,
        ),
      );
    } catch (error) {
      console.log('mailserver 54', error);
    }
  }
  private msg(
    to: string,
    subject: keyof IMail['en'],
    body: {
      name: string;
      url: string;
      index: keyof IMail['en'];
    },
    lang: 'en' | 'vn' = 'en',
  ) {
    const from = this.configService.get('mail_from');
    const msg = {
      to: to,
      from: `Bebes <${from}>`,
      subject: mailSubject()[lang][subject],
      html: mailBody(body.url, body.name)[lang][body.index],
    };

    return msg;
  }
}
