import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Terminal } from 'src/entities/terminal.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TerminalService {
    constructor(
        @InjectRepository(Terminal)
        private terminalRepository: Repository<Terminal>
    ){}

    async getAll() : Promise<Terminal[]>{
        const terminals = await this.terminalRepository.find();
        if(!terminals) throw new NotFoundException('Terminals not found!')
        return terminals;
    }

    async getOne({terminal_id} : {terminal_id: number}) : Promise<Terminal>{
        const terminal = await this.terminalRepository.findOne({where: {id: terminal_id}})
        if(!terminal) throw new NotFoundException('Terminal not found!')
        return terminal;
    }

    async update(terminal_updated: Terminal) : Promise<Terminal>{
        const terminal = await this.terminalRepository.findOneBy({id: terminal_updated.id})
        if(!terminal) throw new NotFoundException('Terminal not found!')
        return await this.terminalRepository.save(terminal_updated);
    }

    async remove(terminal_id: number) : Promise<DeleteResult>{
        const result = await this.terminalRepository.delete({id: terminal_id})
        if(result.affected === 0) throw new NotFoundException('Terminal not found')
        return result;
    }
}
