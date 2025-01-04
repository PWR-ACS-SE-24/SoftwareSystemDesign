import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { HealthcheckDto, HealthcheckStatus } from './healthcheck.dto';

@Controller('/int/v1/')
export class MonitoringController {
  @Get('/health')
  @ApiOkResponse({ type: HealthcheckDto, description: 'Healthcheck status' })
  @ApiResponse({
    type: HealthcheckDto,
    description: 'Internal server error',
    status: HttpStatus.SERVICE_UNAVAILABLE,
    example: { status: <HealthcheckStatus>'UP' },
  })
  async healthcheck(): Promise<HealthcheckDto> {
    return {
      status: 'UP',
    };
  }

  @Get('/endpoints')
  @ApiOkResponse()
  async getEndpoints(): Promise<string[]> {
    return ['WIP'];
  }
}
