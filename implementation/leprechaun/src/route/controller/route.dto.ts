import { LineDto } from '@app/line/controller/line.dto';
import { GenericIdDto } from '@app/shared/api/generic.dto';
import { VehicleDto } from '@app/vehicle/controller/vehicle.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty } from 'class-validator';
import { Route } from '../database/route.entity';

export class RouteDto extends GenericIdDto {
  @IsISO8601()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Start time of the route',
    type: 'string',
    format: 'date-time',
    nullable: false,
    example: '2021-07-29T08:00:00.000Z',
  })
  readonly startTime: string;

  @IsISO8601()
  @IsNotEmpty()
  @ApiProperty({
    description: 'End time of the route',
    type: 'string',
    format: 'date-time',
    nullable: false,
    example: '2021-07-29T08:00:00.000Z',
  })
  readonly endTime: string;

  @IsNotEmpty()
  readonly line: LineDto;

  @IsNotEmpty()
  readonly vehicle: VehicleDto;

  constructor(id: string, startTime: Date, endTime: Date, line: LineDto, vehicle: VehicleDto, isActive: boolean) {
    super(id, isActive);
    this.startTime = startTime.toISOString();
    this.endTime = endTime.toISOString();
    this.line = line;
    this.vehicle = vehicle;
  }

  public static fromEntity(entity: Route): RouteDto {
    return new RouteDto(
      entity.id,
      entity.startTime,
      entity.endTime,
      LineDto.fromEntity(entity.line),
      VehicleDto.fromEntity(entity.vehicle),
      entity.isActive,
    );
  }

  public static fromEntities(entities: Route[]): RouteDto[] {
    return entities.map(RouteDto.fromEntity);
  }
}
