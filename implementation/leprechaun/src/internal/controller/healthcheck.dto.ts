import { ApiProperty } from '@nestjs/swagger';

export const healthcheckValues = ['UP', 'DOWN', 'UNKNOWN', 'OUT_OF_SERVICE'] as const;
export type HealthcheckStatus = (typeof healthcheckValues)[number];

export class HealthcheckDto {
  // TODO: add more fields
  @ApiProperty({ enum: healthcheckValues, example: 'UP' })
  status!: HealthcheckStatus;

  // There is no HealthcheckEntity but to be in line with the other DTOs we will keep it named like this
  static fromEntity(entity: { status: HealthcheckStatus }): HealthcheckDto {
    return entity;
  }
}
