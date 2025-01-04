import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { StopDto } from '../../stop/controller/stop.dto';
import { Line } from '../database/line.entity';

export class LineDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4)
  @ApiProperty({
    description: 'Name of the line',
    maxLength: 4,
    minLength: 1,
    nullable: false,
    examples: ['112', '997', '144', '145'],
  })
  readonly name: string;

  @ApiProperty({
    description: 'Line ID',
    maxLength: 36,
    minLength: 36,
    nullable: false,
    format: 'uuid',
    examples: ['f1b1b9b1-1c1b-7b1b-9b1b-1c1b1b1b1b1b'],
  })
  readonly id: string;

  @ApiProperty({
    description: 'Line status',
    nullable: false,
    examples: [true, false],
  })
  readonly isActive: boolean;

  @ApiProperty({
    description: 'Stops of the line',
    isArray: true,
    items: {
      type: 'array',
      $ref: getSchemaPath(StopDto),
    },
  })
  // FIXME: cant get it to properly show the type
  readonly stops: StopDto[];

  constructor(id: string, name: string, stops: StopDto[], isActive: boolean) {
    this.name = name;
    this.stops = stops;
    this.id = id;
    this.isActive = isActive;
  }

  static fromEntity(entity: Line): LineDto {
    return new LineDto(
      entity.id,
      entity.name,
      entity.mappings.map((i) => StopDto.fromEntity(i.stop)),
      entity.isActive,
    );
  }

  static fromEntities(entities: Line[]): LineDto[] {
    return entities.map(LineDto.fromEntity);
  }
}
