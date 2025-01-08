import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Stop } from '../database/stop.entity';

// TODO: add Lines to StopDto
export class StopDto {
  @ApiProperty({
    description: 'Stop ID',
    nullable: false,
    format: 'uuid',
    maxLength: 36,
    minLength: 36,
    examples: ['b4e9b1c1-9f7d-7b9b-8e9d-1c9f7d4b9b8e'],
  })
  readonly id: string;

  @ApiProperty({
    description: 'Stop status',
    nullable: false,
    examples: [true, false],
  })
  readonly isActive: boolean;

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
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Latitude of the stop',
    nullable: false,
    examples: [51.1079, 51.1079],
  })
  readonly latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Longitude of the stop',
    nullable: false,
    examples: [17.0385, 17.0385],
  })
  readonly longitude: number;

  constructor(id: string, name: string, latitude: number, longitude: number, isActive: boolean) {
    this.id = id;
    this.isActive = isActive;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static fromEntity(entity: Stop): StopDto {
    return new StopDto(entity.id, entity.name, entity.latitude, entity.longitude, entity.isActive);
  }

  static fromEntities(entities: Stop[]): StopDto[] {
    return entities.map(StopDto.fromEntity);
  }
}
