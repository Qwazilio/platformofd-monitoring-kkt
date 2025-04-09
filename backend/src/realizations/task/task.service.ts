import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron('0 13 * * *')
  async handleDailyTask() {
    this.logger.log('Запуск ежедневной задачи в 13:00');

    try {
      // Ваша логика здесь (например, проверка БД и отправка писем)
      this.logger.log('Задача успешно выполнена');
    } catch (error) {
      this.logger.error(`Ошибка в задаче: ${error.message}`);
    }
  }
}
