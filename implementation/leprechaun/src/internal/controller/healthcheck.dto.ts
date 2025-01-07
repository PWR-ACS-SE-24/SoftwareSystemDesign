import { ApiProperty } from '@nestjs/swagger';

export type HealthcheckStatus = 'UP' | 'DOWN' | 'UNKNOWN' | 'OUT_OF_SERVICE';

export class HealthcheckDto {
  @ApiProperty({ enum: ['UP', 'DOWN', 'UNKNOWN', 'OUT_OF_SERVICE'], example: 'UP' })
  status: HealthcheckStatus;

  // TODO: add more fields
  constructor(status: HealthcheckStatus) {
    this.status = status;
  }
}
