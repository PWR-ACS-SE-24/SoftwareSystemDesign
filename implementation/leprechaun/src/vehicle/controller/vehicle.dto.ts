import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Vehicle } from '../database/vehicle.entity';

export class VehicleDto {
  @ApiProperty({
    description: 'Vehicle ID',
    maxLength: 36,
    minLength: 36,
    nullable: false,
    format: 'uuid',
    examples: ['f1b1b9b1-1c1b-4b1b-9b1b-1c1b1b1b1b1b'],
  })
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  @ApiProperty({
    description: 'Side number of the vehicle',
    maxLength: 16,
    minLength: 1,
    nullable: false,
    examples: ['2137', '94102-3170150114'],
  })
  readonly sideNumber: string;

  @ApiProperty({
    description: 'Vehicle status',
    nullable: false,
    examples: [true, false],
  })
  readonly isActive: boolean;

  constructor(id: string, sideNumber: string, isActive: boolean) {
    this.id = id;
    this.sideNumber = sideNumber;
    this.isActive = isActive;
  }

  static fromEntity(entity: Vehicle): VehicleDto {
    return new VehicleDto(entity.id, entity.sideNumber, entity.isActive);
  }

  static fromEntities(entities: Vehicle[]): VehicleDto[] {
    return entities.map((entity) => VehicleDto.fromEntity(entity));
  }
}
