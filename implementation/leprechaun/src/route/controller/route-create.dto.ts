import { IsLaterThan } from '@app/shared/api/date-larger.validator';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsRFC3339, IsUUID } from 'class-validator';
import { RouteDto } from './route.dto';

export class CreateRouteDto extends PickType(RouteDto, ['startTime', 'endTime']) {
  @IsRFC3339()
  @IsNotEmpty()
  readonly startTime: string;

  @IsRFC3339()
  @IsNotEmpty()
  @IsLaterThan('startTime')
  readonly endTime: string;

  @IsNotEmpty()
  @IsUUID('7')
  @ApiProperty({
    description: 'Route line',
    type: 'string',
    format: 'uuid',
    nullable: false,
    example: 'a7f8b7c0-2b4f-7b6e-9e1e-6f2b1b4c4f4d',
  })
  readonly line: string;

  @IsNotEmpty()
  @IsUUID('7')
  @ApiProperty({
    description: 'Vehicle on route',
    type: 'string',
    format: 'uuid',
    nullable: false,
    example: '0194137a-3faf-70fb-8388-6586b32d9c8a',
  })
  readonly vehicle: string;

  constructor(startTime: string, endTime: string, line: string, vehicle: string) {
    super();
    this.startTime = startTime;
    this.endTime = endTime;
    this.line = line;
    this.vehicle = vehicle;
  }
}

export class UpdateRouteDto extends PartialType(PickType(CreateRouteDto, ['line', 'vehicle'])) {
  @IsRFC3339()
  @IsNotEmpty()
  readonly startTime: string;

  @IsRFC3339()
  @IsNotEmpty()
  readonly endTime: string;

  constructor(startTime: string, endTime: string, line: string, vehicle: string) {
    super(line, vehicle);
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
