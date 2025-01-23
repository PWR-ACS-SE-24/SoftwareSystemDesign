import { IsLaterThan } from '@app/shared/api/date-larger.validator';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { RouteDto } from './route.dto';

export class CreateRouteDto extends PickType(RouteDto, ['startTime', 'endTime']) {
  @IsISO8601()
  @IsNotEmpty()
  readonly startTime!: string;

  @IsISO8601()
  @IsNotEmpty()
  @IsLaterThan<CreateRouteDto>('startTime')
  readonly endTime!: string;

  @IsNotEmpty()
  @IsUUID('7')
  @ApiProperty({
    description: 'Route line',
    type: 'string',
    format: 'uuid',
    nullable: false,
    example: 'a7f8b7c0-2b4f-7b6e-9e1e-6f2b1b4c4f4d',
  })
  readonly line!: string;

  @IsNotEmpty()
  @IsUUID('7')
  @ApiProperty({
    description: 'Vehicle on route',
    type: 'string',
    format: 'uuid',
    nullable: false,
    example: '0194137a-3faf-70fb-8388-6586b32d9c8a',
  })
  readonly vehicle!: string;
}

export class UpdateRouteDto extends PartialType(PickType(CreateRouteDto, ['line', 'vehicle'])) {
  @IsISO8601()
  @IsOptional()
  readonly startTime?: string;

  @IsISO8601()
  @IsOptional()
  readonly endTime?: string;
}
