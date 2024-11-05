import { Module } from '@nestjs/common';
import { TerminalService } from './terminal.service';
import { TerminalController } from './terminal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Terminal } from 'src/entities/terminal.entity';
import { CardModule } from '../card/card.module';

@Module({
  imports: [
    CardModule,
    TypeOrmModule.forFeature([Terminal])
  ],
  providers: [TerminalService],
  controllers: [TerminalController],
  exports: [TerminalService]
})
export class TerminalModule {}
