import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TerminalService } from '../terminal/terminal.service';
import { FindOptionsWhere, In, Not } from 'typeorm';
import { Terminal } from '../../entities/terminal.entity';

@Injectable()
export class TaskService {
  constructor(private readonly terminalService: TerminalService) {}

  @Cron('0 8 1 * *')
  async handleMonthTask(): Promise<void> {
    console.log('Call month task');
    const recipients = [process.env.EMAIL_GORODILOV, process.env.EMAIL_SHU];
    const findOptions: FindOptionsWhere<Terminal> = {
      organization: Not(In(['АО "НЕО СЕРВИСЕ"', 'АО "МАСТЕР МИНУТКА"'])),
      stock: false,
      deleted: false,
    };
    try {
      await this.terminalService.checkTerminals(7, 45, recipients, findOptions);
    } catch (error) {
      console.log('Error month crone', error);
    }
  }

  @Cron('0 9 * * *')
  async handleDailyTask(): Promise<void> {
    console.log('Call daily task');
    const recipients = [process.env.EMAIL_SHU];
    const findOptions: FindOptionsWhere<Terminal> = {
      deleted: false,
    };
    try {
      await this.terminalService.checkTerminals(0, 5, recipients, findOptions);
    } catch (error) {
      console.log('Error daily crone', error);
    }
  }
}
