import { Controller, Get } from '@nestjs/common';
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
    async getTerminals() : Promise<Terminal[]>{
        return await this.terminalService.getAll();
    }
}
