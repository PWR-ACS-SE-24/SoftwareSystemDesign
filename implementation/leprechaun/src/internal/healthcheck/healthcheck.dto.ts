import { ApiProperty } from '@nestjs/swagger';

export enum HealthcheckStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  UNKNOWN = 'UNKNOWN',
}

export class HealthcheckDto {
  @ApiProperty({ enum: HealthcheckStatus, example: HealthcheckStatus.UP })
  status: HealthcheckStatus;

  // TODO: add more fields
}
