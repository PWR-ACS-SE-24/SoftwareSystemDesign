import { ApiProperty } from '@nestjs/swagger';

export const HealthcheckValues = ['UP', 'DOWN', 'UNKNOWN', 'OUT_OF_SERVICE'] as const;
export type HealthcheckStatus = (typeof HealthcheckValues)[number];

export class HealthcheckDto {
  @ApiProperty({ enum: HealthcheckValues, example: 'UP' })
  status: HealthcheckStatus;

  // TODO: add more fields
  constructor(status: HealthcheckStatus) {
    this.status = status;
  }
}
