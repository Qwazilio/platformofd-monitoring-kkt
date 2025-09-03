import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('spb')
  async sendSPB(): Promise<void> {
    await this.taskService.nearWorkTerminalsSPB();
  }

  @Get('region')
  async sendRegion(): Promise<void> {
    await this.taskService.nearWorkTerminalsRegion();
  }
}
