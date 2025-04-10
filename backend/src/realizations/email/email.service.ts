import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(recipients: string[], text: string) {
    try {
      await this.mailerService.sendMail({
        to: [...recipients],
        from: 'no-reply <assistant@masterminutka.ru>',
        subject: 'Оповещение о терминалах',
        text: 'Это тестовое письмо от NestJS Mailer!',
        html: text,
      });
      return { success: true, message: 'Письмо отправлено' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
