import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TerminalService } from '../terminal/terminal.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly terminalService: TerminalService, // инжектируем правильный сервис
  ) {}

  @Cron('0 10 1 * *')
  async handleDailyTask(): Promise<void> {
    try {
      await this.terminalService.checkTerminals();
    } catch (error) {
      console.log(error);
    }
  }
}
