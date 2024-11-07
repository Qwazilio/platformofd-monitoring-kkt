import { forwardRef, Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/entities/card.entity';
import { TerminalModule } from '../terminal/terminal.module';

@Module({
  imports: [
    forwardRef(() => TerminalModule),
    TypeOrmModule.forFeature([Card])
  ],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService]
})
export class CardModule {} 
