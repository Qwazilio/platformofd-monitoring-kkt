import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Terminal } from './entities/terminal.entity';
import { Card } from './entities/card.entity';
import { TerminalModule } from './realizations/terminal/terminal.module';
import { CardModule } from './realizations/card/card.module';

@Module({
  imports: [
    TerminalModule,
    CardModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'monitoring_ofd.sqlite',
      entities: [Terminal, Card],
      //entities: [__dirname + '/**/*.entity{.ts}'],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
