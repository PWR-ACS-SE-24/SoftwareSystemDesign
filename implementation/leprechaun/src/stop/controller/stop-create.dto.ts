import { PartialType, PickType } from '@nestjs/swagger';
import { StopDto } from './stop.dto';

export class CreateStopDto extends PickType(StopDto, ['name', 'latitude', 'longitude'] as const) {
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;

  constructor(name: string, latitude: number, longitude: number) {
    super();
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

export class UpdateStopDto extends PartialType(CreateStopDto) {}
