import { ApiProperty } from '@nestjs/swagger';

export const HealthcheckStatus = {
  UP: 'UP',
  DOWN: 'DOWN',
  UNKNOWN: 'UNKNOWN',
  OUT_OF_SERVICE: 'OUT_OF_SERVICE',
} as const;

type Values<Object> = Object[keyof Object];

export class HealthcheckDto {
  @ApiProperty({ enum: () => Object.keys(HealthcheckStatus), example: HealthcheckStatus.UP })
  status: Values<typeof HealthcheckStatus>;

  // TODO: add more fields
}
