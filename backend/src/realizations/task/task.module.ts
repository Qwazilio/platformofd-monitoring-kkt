import { Module } from '@nestjs/common';
import { TerminalModule } from '../terminal/terminal.module';
import { TaskService } from './task.service';

@Module({
  imports: [TerminalModule],
  providers: [TaskService],
  controllers: [],
  exports: [TaskService],
})
export class TaskModule {}
