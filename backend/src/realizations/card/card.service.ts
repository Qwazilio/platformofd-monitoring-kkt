import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/entities/card.entity';
import { Terminal } from 'src/entities/terminal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  async getAll(): Promise<Card[]> {
    const cards = await this.cardRepository.find({
      relations: ['terminal'],
    });
    if (!cards) throw new NotFoundException('Cards not found!');
    return cards;
  }

  async getOne(card_id: number): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id: card_id } });
    if (!card) throw new NotFoundException('Card not found!');
    return card;
  }

  async getOneByUid(uid_card: string): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { uid_card: uid_card },
    });
    if (!card) throw new NotFoundException('Card not found!');
    return card;
  }

  async add(card: Card): Promise<Card> {
    const card_old = await this.cardRepository.findOne({
      where: { uid_card: card.uid_card },
    });
    if (card_old) {
      return card_old;
    }
    const card_new = this.cardRepository.create({
      uid_card: card.uid_card,
      end_date_card: card.end_date_card,
    });

    return await this.cardRepository.save(card_new);
  }

  async upsert(card_updated: Card, kkt: Terminal): Promise<Card> {
    const card = await this.cardRepository.findOneBy({
      uid_card: card_updated.uid_card,
    });
    if (!card) {
      return await this.add(card_updated);
    }
    this.cardRepository.merge(card, {
      uid_card: card_updated.uid_card,
      end_date_card: card_updated.end_date_card,
    });
    return await this.cardRepository.save(card);
  }
}
