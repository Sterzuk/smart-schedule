import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      success: true,
      status: 'ok',
      service: 'smart-schedule-api',
      health: '/api/health',
    };
  }

  @Get('health')
  health() {
    return {
      success: true,
      status: 'ok',
      service: 'smart-schedule-api',
      timestamp: new Date().toISOString(),
    };
  }
}
