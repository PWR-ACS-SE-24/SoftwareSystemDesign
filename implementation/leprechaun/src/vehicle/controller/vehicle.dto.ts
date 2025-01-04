import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from '../database/vehicle.entity';
import { CreateVehicleDto } from './vehicle-create.dto';

export class VehicleDto extends CreateVehicleDto {
  @ApiProperty({
    description: 'Vehicle ID',
    maxLength: 36,
    minLength: 36,
    nullable: false,
    format: 'uuid',
    examples: ['f1b1b9b1-1c1b-4b1b-9b1b-1c1b1b1b1b1b'],
  })
  readonly id: string;

  @ApiProperty({
    description: 'Vehicle status',
    nullable: false,
    examples: [true, false],
  })
  readonly isActive: boolean;

  constructor(id: string, sideNumber: string, isActive: boolean) {
    super(sideNumber);
    this.id = id;
    this.isActive = isActive;
  }

  static fromEntity(entity: Vehicle): VehicleDto {
    return new VehicleDto(entity.id, entity.sideNumber, entity.isActive);
  }

  static fromEntities(entities: Vehicle[]): VehicleDto[] {
    return entities.map((entity) => VehicleDto.fromEntity(entity));
  }
}
