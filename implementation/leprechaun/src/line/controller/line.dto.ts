import { GenericIdActiveDto } from '@app/shared/api/generic.dto';
import { StopDto } from '@app/stop/controller/stop.dto';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Line } from '../database/line.entity';

export class LineDto extends GenericIdActiveDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4)
  @ApiProperty({
    description: 'Name of the line',
    maxLength: 4,
    minLength: 1,
    nullable: false,
    examples: ['144', '145', 'N', 'AN11', 'a1', 'a2'],
  })
  readonly name!: string;

  @ApiProperty({
    description: 'Stops of the line',
    isArray: true,
    items: {
      type: 'array',
      $ref: getSchemaPath(StopDto),
    },
  })
  // FIXME: cant get it to properly show the type
  readonly stops!: StopDto[];

  static fromEntity(entity: Line): LineDto {
    const dto = new LineDto();
    Object.assign(dto, <LineDto>{
      id: entity.id,
      stops: entity.mappings.map((i) => StopDto.fromEntity(i.stop)),
      name: entity.name,
      isActive: entity.isActive,
    });
    return dto;
  }

  static fromEntities(entities: Line[]): LineDto[] {
    return entities.map(LineDto.fromEntity);
  }
}
