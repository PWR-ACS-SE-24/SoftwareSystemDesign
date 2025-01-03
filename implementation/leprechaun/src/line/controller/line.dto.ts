import { ApiProperty } from '@nestjs/swagger';
import { Line } from '../database/line.entity';
import { CreateLineDto } from './line-create.dto';

export class LineDto extends CreateLineDto {
  @ApiProperty({
    description: 'Line ID',
    nullable: false,
    examples: ['b4e9b1c1-9f7d-7b9b-8e9d-1c9f7d4b9b8e'],
  })
  readonly id: string;

  @ApiProperty({
    description: 'Line status',
    nullable: false,
    examples: [true, false],
  })
  readonly isActive: boolean;

  constructor(id: string, name: string, isActive: boolean) {
    super(name);
    this.id = id;
    this.isActive = isActive;
  }

  static fromEntity(entity: Line): LineDto {
    return new LineDto(entity.id, entity.name, entity.isActive);
  }

  static fromEntities(entities: Line[]): LineDto[] {
    return entities.map(LineDto.fromEntity);
  }
}
