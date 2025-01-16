import { GenericIdActiveDto } from '@app/shared/api/generic.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Vehicle } from '../database/vehicle.entity';

export class VehicleDto extends GenericIdActiveDto {
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
  readonly sideNumber!: string;

  static fromEntity(entity: Vehicle): VehicleDto {
    const dto = new VehicleDto();
    Object.assign(dto, <VehicleDto>{
      id: entity.id,
      sideNumber: entity.sideNumber,
      isActive: entity.isActive,
    });
    return dto;
  }

  static fromEntities(entities: Vehicle[]): VehicleDto[] {
    return entities.map((entity) => VehicleDto.fromEntity(entity));
  }
}

export class SideNumberDto extends PickType(VehicleDto, ['sideNumber'] as const) {}
