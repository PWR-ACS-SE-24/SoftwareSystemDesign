import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { MonitoringService } from '../service/monitoring.service';
import { HealthcheckDto } from './healthcheck.dto';
import { EndpointDto } from './routes.dto';

@Controller('/int/v1/')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('/health')
  @ApiOkResponse({ type: HealthcheckDto, description: 'Healthcheck status' })
  @ApiResponse({
    type: HealthcheckDto,
    description: 'Internal server error',
    status: HttpStatus.SERVICE_UNAVAILABLE,
    example: { status: 'UP' },
  })
  async healthcheck(): Promise<HealthcheckDto> {
    return {
      status: 'UP',
    };
  }

  @Get('/endpoints')
  @ApiOkResponse({ type: EndpointDto, description: 'List of available endpoints', isArray: true })
  async getEndpoints(): Promise<EndpointDto[]> {
    return this.monitoringService.getAllEndpoints();
  }
}
