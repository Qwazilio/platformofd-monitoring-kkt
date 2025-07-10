import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/entities/card.entity';
import { Terminal } from 'src/entities/terminal.entity';
import { Between, DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { EmailService } from '../email/email.service';

@Injectable()
export class TerminalService {
  constructor(
    @InjectRepository(Terminal)
    private terminalRepository: Repository<Terminal>,
    private readonly emailService: EmailService,
  ) {}

  async getAll(): Promise<Terminal[]> {
    const terminals = await this.terminalRepository.find({
      relations: ['active_card', 'cards'],
    });
    if (!terminals) throw new NotFoundException('Terminals not found!');
    return terminals;
  }

  async getOne({ terminal_id }: { terminal_id: number }): Promise<Terminal> {
    const terminal = await this.terminalRepository.findOne({
      where: { id: terminal_id },
      relations: ['active_card'],
    });
    if (!terminal) throw new NotFoundException('Terminal not found!');
    return terminal;
  }

  async getOneByUid({
    uid_terminal,
  }: {
    uid_terminal: string;
  }): Promise<Terminal> {
    const terminal = await this.terminalRepository.findOne({
      where: { uid_terminal: uid_terminal },
      relations: ['active_card'],
    });
    if (!terminal) throw new NotFoundException('Terminal not found!');
    return terminal;
  }

  async add(terminal: Partial<Terminal>): Promise<Terminal> {
    const terminal_old = await this.terminalRepository.findOne({
      where: { uid_terminal: terminal.uid_terminal },
    });
    if (terminal_old)
      throw new ConflictException(
        `Terminal with UID:${terminal.uid_terminal} already exists`,
      );
    const terminal_new = this.terminalRepository.create(terminal);
    return await this.terminalRepository.save(terminal_new);
  }

  async update(terminal_updated: Partial<Terminal>): Promise<Terminal> {
    const terminal = await this.terminalRepository.findOneBy({
      id: terminal_updated.id,
    });
    if (!terminal) throw new NotFoundException('Terminal not found!');
    this.terminalRepository.merge(terminal, terminal_updated);
    return await this.terminalRepository.save(terminal);
  }

  async upsert(
    terminal_updated: Partial<Terminal>,
    card_updated?: Partial<Card>,
  ): Promise<Terminal> {
    const terminal = await this.terminalRepository.findOne({
      where: { uid_terminal: terminal_updated.uid_terminal },
      relations: ['active_card'],
    });
    if (!terminal) return await this.add(terminal_updated);
    if (terminal.active_card && card_updated) {
      if (!card_updated.end_date_card) return terminal;
      else if (
        terminal.active_card.end_date_card.getTime() >
        new Date(card_updated.end_date_card).getTime()
      )
        return terminal;
    }
    this.terminalRepository.merge(terminal, terminal_updated);
    return await this.terminalRepository.save(terminal);
  }

  async remove(terminal_id: number): Promise<DeleteResult> {
    const result = await this.terminalRepository.delete({ id: terminal_id });
    if (result.affected === 0)
      throw new NotFoundException('Terminal not found');
    return result;
  }

  async checkTerminals(
    dayStart: number,
    dayEnd: number,
    recipient: string[],
    findOptions: FindOptionsWhere<Terminal> | FindOptionsWhere<Terminal>[],
  ): Promise<any> {
    const futureDate = (addDays: number): Date => {
      const nowDate = new Date();
      nowDate.setDate(nowDate.getDate() + addDays);
      return nowDate;
    };

    const [terminals] = await Promise.all([
      this.terminalRepository.find({
        select: [
          'uid_terminal',
          'name_terminal',
          'organization',
          'address',
          'active_card',
        ],
        where: {
          ...findOptions,
          active_card: {
            end_date_card: Between(futureDate(dayStart), futureDate(dayEnd)),
          },
        },
        order: {
          active_card: {
            end_date_card: 'ASC',
          },
        },
        relations: ['active_card'],
      }),
    ]);

    if (!terminals || terminals.length === 0) {
      console.log(
        'Нет терминалов с подходящими сроками — письмо не отправляется.',
      );
      return;
    }
    const message: string[] = [];
    terminals.forEach((terminal: Terminal) => {
      if (!terminal.active_card) return;

      const rawDate = new Date(terminal.active_card.end_date_card);
      const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}-${String(rawDate.getMonth() + 1).padStart(2, '0')}-${rawDate.getFullYear()}`;

      const partMessage: string = `<li>     
                                      <h3>${terminal.name_terminal}</h3> 
                                      <ul>
                                        <li>Организация: ${terminal.organization}</li>
                                        <li>ККТ: ${terminal.uid_terminal}</li>
                                        <li>Адрес: ${terminal.address}</li>
                                        <li>Дата окончания ФН: ${formattedDate}</li>
                                      </ul>                                      
                                    </li>`;
      message.push(partMessage);
      console.log(`Message send to ${recipient}`);
    });
    const content: string = `
      <h2>Сводка по ближайшим срокам окончания ФН в терминалах</h2>
      <ol>
        ${message.join('\n')}
      </ol>
    `;
    await this.emailService.sendEmail(
      recipient,
      'Срок действия ФН истекает!',
      content,
    );
  }
}
