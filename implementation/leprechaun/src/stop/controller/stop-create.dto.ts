import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateStopDto {
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

  constructor(name: string, latitude: number, longitude: number) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

export class UpdateStopDto extends PartialType(CreateStopDto) {}
