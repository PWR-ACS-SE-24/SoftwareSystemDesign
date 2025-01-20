import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { AccidentDto } from './accident.dto';

export class CreateAccidentDto extends PickType(AccidentDto, ['time', 'description'] as const) {
  @IsUUID('7')
  @ApiProperty({
    description: 'Route of the accident',
    nullable: false,
    type: 'string',
  })
  readonly route!: string;
}

export class UpdateAccidentDto extends PartialType(PickType(CreateAccidentDto, ['description'] as const)) {}
