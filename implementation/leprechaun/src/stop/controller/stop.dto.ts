import { GenericIdActiveDto } from '@app/shared/api/generic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Stop } from '../database/stop.entity';

// TODO: add Lines to StopDto
export class StopDto extends GenericIdActiveDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Name of the stop',
    maxLength: 255,
    minLength: 1,
    nullable: false,
    examples: ['Zagony', 'pl. Grunwaldzki', 'Dworzec Główny'],
  })
  readonly name!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Latitude of the stop',
    nullable: false,
    examples: [51.1079, 51.1079],
  })
  readonly latitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Longitude of the stop',
    nullable: false,
    examples: [17.0385, 17.0385],
  })
  readonly longitude!: number;

  static fromEntity(entity: Stop): StopDto {
    const dto = new StopDto();
    Object.assign(dto, <StopDto>{
      id: entity.id,
      name: entity.name,
      latitude: entity.latitude,
      longitude: entity.longitude,
      isActive: entity.isActive,
    });
    return dto;
  }

  static fromEntities(entities: Stop[]): StopDto[] {
    return entities.map(StopDto.fromEntity);
  }
}
