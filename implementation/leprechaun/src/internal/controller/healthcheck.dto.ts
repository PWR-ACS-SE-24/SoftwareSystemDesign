import { ApiProperty } from '@nestjs/swagger';

export const healthcheckValues = ['UP', 'DOWN', 'UNKNOWN', 'OUT_OF_SERVICE'] as const;
export type HealthcheckStatus = (typeof healthcheckValues)[number];

export class HealthcheckDto {
  @ApiProperty({ enum: healthcheckValues, example: 'UP' })
  status: HealthcheckStatus;

  // TODO: add more fields
  constructor(status: HealthcheckStatus) {
    this.status = status;
  }
}
