import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { HealthcheckDto, HealthcheckStatus } from './healthcheck.dto';

@Controller('healthcheck')
export class HealthcheckController {
  @Get('/')
  @ApiOkResponse({ type: HealthcheckDto, description: 'Healthcheck status' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  healthcheck(): HealthcheckDto {
    return {
      status: HealthcheckStatus.UP,
    };
  }
}
