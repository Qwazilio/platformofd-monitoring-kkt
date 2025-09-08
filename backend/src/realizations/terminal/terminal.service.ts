import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Terminal } from 'src/entities/terminal.entity';
import { Between, DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { EmailService } from '../email/email.service';
import { CardService } from '../card/card.service';
import { Card } from '../../entities/card.entity';

@Injectable()
export class TerminalService {
  constructor(
    @InjectRepository(Terminal)
    private terminalRepository: Repository<Terminal>,
    private readonly cardService: CardService,
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

  async getOneByUid(uid_kkt: string): Promise<Terminal> {
    const terminal = await this.terminalRepository.findOne({
      where: { uid_terminal: uid_kkt },
      relations: ['active_card'],
    });
    if (!terminal) throw new NotFoundException('Terminal not found!');
    return terminal;
  }

  async add(terminal: Partial<Terminal>): Promise<Terminal> {
    const terminal_old = await this.terminalRepository.findOne({
      where: { uid_terminal: terminal.uid_terminal },
      relations: ['active_card'],
    });
    if (terminal_old) {
      console.log(`Terminal with UID:${terminal.uid_terminal} already exists`);
      return terminal_old;
    }
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

  async upsert(kkt_updated: Partial<Terminal>): Promise<Terminal> {
    if (!kkt_updated) return;
    if (!kkt_updated.active_card) return;

    const kkt = await this.add(kkt_updated);

    //Если ФН не был добавлен, то добавляем его
    if (!kkt.active_card) {
      kkt_updated.active_card = await this.cardService.add(
        kkt_updated.active_card,
      );
      kkt.active_card = kkt_updated.active_card;
      const kkt_merged = this.terminalRepository.merge(kkt, kkt_updated);
      return await this.terminalRepository.save(kkt_merged);
    }

    //Обвноялем данные терминала, если он уже существует
    if (
      kkt_updated.active_card &&
      kkt.active_card.uid_card == kkt_updated.active_card.uid_card
    ) {
      const kkt_merged = this.terminalRepository.merge(kkt, kkt_updated);
      console.log(kkt_merged);
      return await this.terminalRepository.save(kkt_merged);
    } else if (!kkt_updated.active_card) {
      const kkt_merged = this.terminalRepository.merge(kkt, kkt_updated);
      return await this.terminalRepository.save(kkt_merged);
    }

    //Если ФН обновился, проверяем дату окончания и меняем данные
    if (
      new Date(kkt.active_card.end_date_card).getTime() <
      new Date(kkt_updated.active_card.end_date_card).getTime()
    ) {
      kkt_updated.active_card = await this.cardService.add(
        kkt_updated.active_card,
      );
      kkt.active_card = kkt_updated.active_card;
      const kkt_merged = this.terminalRepository.merge(kkt, kkt_updated);
      return await this.terminalRepository.save(kkt_merged);
    } else {
      return kkt;
    }
  }

  async attachCard(kkt_uid: string, card: Card): Promise<Terminal> {
    const kkt = await this.getOneByUid(kkt_uid);
    if (!kkt) {
      throw new NotFoundException('Terminal not found!');
    }
    kkt.active_card = await this.cardService.add(card);
    await this.terminalRepository.save(kkt);
    return;
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
  ): Promise<void> {
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
        relations: ['active_card'],
        order: {
          active_card: {
            end_date_card: 'ASC', // сортировка по дате окончания ФН
          },
          organization: 'ASC', // доп. сортировка
        },
      }),
    ]);

    if (!terminals || terminals.length === 0) {
      throw new NotFoundException('Terminals not found!');
    }

    // Собираем список терминалов в HTML
    const terminalList = terminals
      .filter((terminal) => terminal.active_card)
      .map((terminal) => {
        const time = new Date(terminal.active_card.end_date_card).getTime();
        const diffMs = time - Date.now();
        const diffM = Math.round(diffMs / 1000 / 60 / 60 / 24);

        const rawDate = new Date(terminal.active_card.end_date_card);
        const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}-${String(
          rawDate.getMonth() + 1,
        ).padStart(2, '0')}-${rawDate.getFullYear()}`;

        return `
        <li>
          <b>${terminal.name_terminal}</b><br/>
          Организация: ${terminal.organization}<br/>
          ККТ: ${terminal.uid_terminal}<br/>
          Адрес: ${terminal.address}<br/>
          Дата окончания ФН: ${formattedDate}<br/>
          Осталось дней: ${diffM}
        </li>
      `;
      })
      .join('');

    // Отправляем одно письмо со всеми терминалами
    const htmlMessage = `
    <div>
      <h2>Оповещение о терминалах (ФН)</h2>
      <p>Следующие терминалы подходят к окончанию действия ФН:</p>
      <ul>
        ${terminalList}
      </ul>
    </div>
  `;

    // await this.emailService.sendEmail(
    //   recipient,
    //   'Оповещение о терминалах (ФН)',
    //   htmlMessage,
    // );

    console.log(
      `Message send to ${recipient} (терминалов: ${terminals.length})`,
    );
  }
}
