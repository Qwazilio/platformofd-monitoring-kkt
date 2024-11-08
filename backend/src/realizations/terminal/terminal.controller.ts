import { Body, Controller, Get, Post } from '@nestjs/common';
import { TerminalService } from './terminal.service';
import { CardService } from '../card/card.service';
import { Terminal } from 'src/entities/terminal.entity';

@Controller('terminal')
export class TerminalController {
    constructor(
        private readonly terminalService: TerminalService,
        private readonly cardService: CardService
    ){}

    @Get('list')
    async getTerminals() : Promise<Terminal[]> {
        return await this.terminalService.getAll();
    }

    @Post('add')
    async addTerminal(
        @Body() terminal : Partial<Terminal>
    ) : Promise<Terminal> {
        return await this.terminalService.add(terminal);
    }

    @Get()
    async getTerminal(
        @Body() {terminal_id} : {terminal_id: number}
    ) : Promise<Terminal>{
        return await this.terminalService.getOne({terminal_id : terminal_id})
    }
}
