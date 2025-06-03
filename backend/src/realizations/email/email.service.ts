import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    recipients: string[],
    subject: string = 'Оповещение от помощника',
    text?: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: [...recipients],
        from: 'no-reply <assistant@masterminutka.ru>',
        subject: subject,
        text: 'Автоматически сгенерированное сообщение',
        html: text,
      });
      return { success: true, message: 'Письмо отправлено' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
