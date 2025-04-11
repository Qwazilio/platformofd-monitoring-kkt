import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TerminalService } from '../terminal/terminal.service';

@Injectable()
export class TaskService {
  constructor(private readonly terminalService: TerminalService) {}

  @Cron('0 8 1 * *')
  async handleMonthTask(): Promise<void> {
    try {
      await this.terminalService.checkTerminals(3, 45);
    } catch (error) {
      console.log('Error month crone', error);
    }
  }

  @Cron('0 8 * * *')
  async handleDailyTask(): Promise<void> {
    try {
      await this.terminalService.checkTerminals(0, 3);
    } catch (error) {
      console.log('Error daily crone', error);
    }
  }
}
