import { PartialType, PickType } from '@nestjs/swagger';
import { VehicleDto } from './vehicle.dto';

export class CreateVehicleDto extends PickType(VehicleDto, ['sideNumber'] as const) {
  readonly sideNumber!: string;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
