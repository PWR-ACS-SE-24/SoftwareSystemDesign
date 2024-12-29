import { ApiProperty } from '@nestjs/swagger';
import { Stop } from '../database/stop.entity';
import { CreateStopDto } from './stop-create.dto';

// TODO: add Lines to StopDto
export class StopDto extends CreateStopDto {
  @ApiProperty({
    description: 'Stop ID',
    nullable: false,
    examples: ['b4e9b1c1-9f7d-7b9b-8e9d-1c9f7d4b9b8e'],
  })
  readonly id: string;

  @ApiProperty({
    description: 'Stop status',
    nullable: false,
    examples: [true, false],
  })
  readonly isActive: boolean;

  constructor(id: string, name: string, latitude: number, longitude: number, isActive: boolean) {
    super(name, latitude, longitude);
    this.id = id;
    this.isActive = isActive;
  }

  static fromEntity(entity: Stop): StopDto {
    return new StopDto(entity.id, entity.name, entity.latitude, entity.longitude, entity.isActive);
  }

  static fromEntities(entities: Stop[]): StopDto[] {
    return entities.map(StopDto.fromEntity);
  }
}
