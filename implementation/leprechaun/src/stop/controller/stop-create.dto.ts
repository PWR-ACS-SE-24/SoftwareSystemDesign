import { PartialType, PickType } from '@nestjs/swagger';
import { StopDto } from './stop.dto';

export class CreateStopDto extends PickType(StopDto, ['name', 'latitude', 'longitude'] as const) {
  readonly name!: string;
  readonly latitude!: number;
  readonly longitude!: number;
}

export class UpdateStopDto extends PartialType(CreateStopDto) {}
