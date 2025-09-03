import { Module } from '@nestjs/common';
import { TerminalModule } from '../terminal/terminal.module';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [TerminalModule],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
