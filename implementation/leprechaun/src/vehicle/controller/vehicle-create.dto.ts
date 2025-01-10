import { PartialType, PickType } from '@nestjs/swagger';
import { VehicleDto } from './vehicle.dto';

export class CreateVehicleDto extends PickType(VehicleDto, ['sideNumber'] as const) {
  readonly sideNumber: string;

  constructor(sideNumber: string) {
    super();
    this.sideNumber = sideNumber;
  }
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
