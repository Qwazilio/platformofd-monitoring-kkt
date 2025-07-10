import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TerminalService } from '../terminal/terminal.service';
import { In, Not } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(private readonly terminalService: TerminalService) {}

  @Cron('0 8 1 * *')
  async handleMonthlyTask(): Promise<void> {
    console.log('Call monthly task');
    await this.nearWorkTerminalsRegion();
  }

  @Cron('0 8 * * *')
  async handleDailyTask(): Promise<void> {
    console.log('Call daily task');
    await this.nearAllTerminals();
    await this.nearWorkTerminalsSPB();
  }

  async nearAllTerminals(): Promise<void> {
    const recipient = [process.env.EMAIL_ADMIN];
    const findOptions = {
      deleted: false,
    };
    try {
      await this.terminalService.checkTerminals(2, 3, recipient, findOptions);
    } catch (error) {
      console.log('Error crone in All task', error);
    }
  }

  async nearWorkTerminalsSPB(): Promise<void> {
    const recipient = [process.env.EMAIL_SKLAD];
    const findOptions = {
      deleted: false,
      stock: false,
      organization: Not(In([process.env.DB, process.env.MMR])),
    };
    try {
      await this.terminalService.checkTerminals(7, 8, recipient, findOptions);
    } catch (error) {
      console.log('Error crone in SPB task', error);
    }
  }

  async nearWorkTerminalsRegion(): Promise<void> {
    const recipient = [process.env.EMAIL_SKLAD, process.env.EMAIL_ADMIN];
    const findOptions = {
      deleted: false,
      stock: false,
      organization: Not(In([process.env.NEO, process.env.MM, process.env.IP])),
    };
    try {
      await this.terminalService.checkTerminals(15, 45, recipient, findOptions);
    } catch (error) {
      console.log('Error crone in regions task', error);
    }
  }
}
