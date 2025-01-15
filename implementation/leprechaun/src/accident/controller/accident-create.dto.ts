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

  constructor(time: Date, resolved: boolean, description: string, route: string) {
    super(time, resolved, description);
    this.route = route;
  }
}

export class UpdateAccidentDto extends PartialType(PickType(CreateAccidentDto, ['description'] as const)) {}
