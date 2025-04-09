import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Terminal } from './entities/terminal.entity';
import { Card } from './entities/card.entity';
import { TerminalModule } from './realizations/terminal/terminal.module';
import { CardModule } from './realizations/card/card.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './realizations/task/task.module';

@Module({
  controllers: [AppController],
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TerminalModule,
    CardModule,
    TaskModule,
    MailerModule.forRoot({
      transport: `smtps://${process.env.SMTP_USER}:${process.env.SMTP_PASSWORD}@${process.env.SMTP_HOST}`,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'monitoring_ofd.sqlite',
      entities: [Terminal, Card],
      //entities: [__dirname + '/**/*.entity{.ts}'],
      synchronize: true,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
