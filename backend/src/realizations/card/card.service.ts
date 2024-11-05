import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/entities/card.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private cardRepository: Repository<Card>
    ){}

    async getOne(card_id: number): Promise<Card>{
        const card = await this.cardRepository.findOne({where: {id: card_id}});
        if(!card) throw new NotFoundException('Card not found!')
        return card;
    }
}
