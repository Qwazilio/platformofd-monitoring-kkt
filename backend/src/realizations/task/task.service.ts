import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TerminalService } from '../terminal/terminal.service';
import { In, Not } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(private readonly terminalService: TerminalService) {}

  @Cron('0 9 1 * *')
  async handleMonthlyTask(): Promise<void> {
    console.log('Call monthly task');
    await this.nearWorkTerminalsRegion();
  }

  @Cron('0 9 * * *')
  async handleDailyTask(): Promise<void> {
    console.log('Call daily task');
    await this.nearAllTerminals();
    await this.nearWorkTerminalsSPB();
  }

  async nearAllTerminals(): Promise<void> {
    const recipient = [process.env.EMAIL_SHU];
    const findOptions = {
      deleted: false,
    };
    try {
      await this.terminalService.checkTerminals(0, 4, recipient, findOptions);
    } catch (error) {
      console.log('Error crone in All task', error);
    }
  }

  async nearWorkTerminalsSPB(): Promise<void> {
    const recipient = [process.env.EMAIL_GORODILOV];
    const findOptions = {
      deleted: false,
      stock: false,
      organization: In([
        'АО "НЕО СЕРВИСЕ"',
        'АО "МАСТЕР МИНУТКА"',
        'ИП Жидков Андрей Юрьевич',
      ]),
    };
    try {
      await this.terminalService.checkTerminals(4, 5, recipient, findOptions);
    } catch (error) {
      console.log('Error crone in SPB task', error);
    }
  }

  async nearWorkTerminalsRegion(): Promise<void> {
    const recipient = [process.env.EMAIL_GORODILOV, process.env.EMAIL_SHU];
    const findOptions = {
      deleted: false,
      stock: false,
      organization: Not(
        In([
          'АО "НЕО СЕРВИСЕ"',
          'АО "МАСТЕР МИНУТКА"',
          'ИП Жидков Андрей Юрьевич',
        ]),
      ),
    };
    try {
      await this.terminalService.checkTerminals(15, 45, recipient, findOptions);
    } catch (error) {
      console.log('Error crone in regions task', error);
    }
  }
}
