import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TerminalService } from './terminal.service';
import { CardService } from '../card/card.service';
import { Terminal } from 'src/entities/terminal.entity';
import { EmailService } from '../email/email.service';

@Controller('terminal')
export class TerminalController {
  constructor(
    private readonly terminalService: TerminalService,
    private readonly cardService: CardService,
    private readonly emailTestService: EmailService,
  ) {}

  @Get('list')
  async getTerminals(): Promise<Terminal[]> {
    return await this.terminalService.getAll();
  }

  @Post('add')
  async addTerminal(@Body() terminal: Partial<Terminal>): Promise<Terminal> {
    return await this.terminalService.add(terminal);
  }

  @Get()
  async getTerminal(@Query('id') kkt_id: number): Promise<Terminal> {
    return await this.terminalService.getOne({ terminal_id: kkt_id });
  }

  @Get('test')
  async getTest(): Promise<boolean> {
    return true;
  }
}
