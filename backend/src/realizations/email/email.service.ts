import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailTestService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTestEmail() {
    try {
      await this.mailerService.sendMail({
        to: `${process.env.EMAIL_SHU}`, // Укажите ваш email для проверки
        subject: 'Тестовое письмо',
        text: 'Это тестовое письмо от NestJS Mailer!',
        html: '<b>Поздравляем, письмо отправлено!</b>',
      });
      return { success: true, message: 'Письмо отправлено' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
