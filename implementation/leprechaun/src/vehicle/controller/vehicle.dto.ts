import { GenericIdDto } from '@app/shared/api/generic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Vehicle } from '../database/vehicle.entity';

export class VehicleDto extends GenericIdDto {
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

  constructor(id: string, sideNumber: string, isActive: boolean) {
    super(id, isActive);
    this.sideNumber = sideNumber;
  }

  static fromEntity(entity: Vehicle): VehicleDto {
    return new VehicleDto(entity.id, entity.sideNumber, entity.isActive);
  }

  static fromEntities(entities: Vehicle[]): VehicleDto[] {
    return entities.map((entity) => VehicleDto.fromEntity(entity));
  }
}
