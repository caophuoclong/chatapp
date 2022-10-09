import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '~/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService
    ) {}

  async sendUserConfirmation(user: User, token: string, lan: "en" | "vn") {
    const url = `${this.configService.get("client_host")}/auth/confirm?token=${token}&lan=${lan}`;
    console.log(url);
    try{
      return await this.mailerService.sendMail({
        to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: lan === "en" ? 'Welcome to Bebes! Confirm your Email' : 'Chào mừng bạn đến với Bebes! Xác nhận email của bạn',
      template: lan === "en" ? './confirmation_en' : './confirmation_vn', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }catch(error){
    console.log(error);
  }
  }
  async sendMailRecovery(user: User,url: string, lan: "en" | "vn"){
    try{
      return await this.mailerService.sendMail({
        to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: lan === "en" ? 'Recovery Password' : 'Khôi phục mật khẩu',
      template: lan === "en" ? './recoveryPassword_en' : './recoveryPassword_vn', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }catch(error){
    console.log(error);
  }
  }
}