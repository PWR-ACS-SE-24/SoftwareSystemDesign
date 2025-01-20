import { LineDto } from '@app/line/controller/line.dto';
import { GenericIdActiveDto, GenericIdDto, UUIDApiProperty } from '@app/shared/api/generic.dto';
import { VehicleDto } from '@app/vehicle/controller/vehicle.dto';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty } from 'class-validator';
import { Route } from '../database/route.entity';

const startTimeProperty: ApiPropertyOptions = {
  description: 'Start time of the route',
  type: 'string',
  format: 'date-time',
  nullable: false,
  example: '2021-07-29T08:00:00.000Z',
};

const endTimeProperty: ApiPropertyOptions = {
  description: 'End time of the route',
  type: 'string',
  format: 'date-time',
  nullable: false,
  example: '2021-07-29T08:00:00.000Z',
};

export class RouteDto extends GenericIdActiveDto {
  @IsISO8601()
  @IsNotEmpty()
  @ApiProperty(startTimeProperty)
  readonly startTime!: string;

  @IsISO8601()
  @IsNotEmpty()
  @ApiProperty(endTimeProperty)
  readonly endTime!: string;

  @IsNotEmpty()
  readonly line!: LineDto;

  @IsNotEmpty()
  readonly vehicle!: VehicleDto;

  public static fromEntity(entity: Route): RouteDto {
    return Object.assign(new RouteDto(), <RouteDto>{
      id: entity.id,
      startTime: entity.startTime.toISOString(),
      endTime: entity.endTime.toISOString(),
      line: LineDto.fromEntity(entity.line),
      vehicle: VehicleDto.fromEntity(entity.vehicle),
      isActive: entity.isActive,
    });
  }

  public static fromEntities(entities: Route[]): RouteDto[] {
    return entities.map(RouteDto.fromEntity);
  }
}
export class MinimalRouteDto extends GenericIdDto {
  @IsISO8601()
  @ApiProperty(startTimeProperty)
  readonly startTime!: string;

  @IsISO8601()
  @ApiProperty(endTimeProperty)
  readonly endTime!: string;

  @ApiProperty({ description: 'Name of the line', type: 'string', nullable: false, example: '141' })
  readonly lineName!: string;

  @ApiProperty({ ...UUIDApiProperty, description: 'ID of the line' })
  readonly line!: string;

  @ApiProperty({ description: 'Side number of the vehicle', type: 'string', nullable: false, example: '2137' })
  readonly vehicleSideNumber!: string;

  @ApiProperty({ ...UUIDApiProperty, description: 'ID of the vehicle' })
  readonly vehicle!: string;

  public static fromEntity(entity: Route): MinimalRouteDto {
    const dto = new MinimalRouteDto();
    Object.assign(dto, <MinimalRouteDto>{
      id: entity.id,
      startTime: entity.startTime.toISOString(),
      endTime: entity.endTime.toISOString(),
      lineName: entity.line.name,
      line: entity.line.id,
      vehicleSideNumber: entity.vehicle.sideNumber,
      vehicle: entity.vehicle.id,
    });
    return dto;
  }

  public static fromEntities(entities: Route[]): MinimalRouteDto[] {
    return entities.map(MinimalRouteDto.fromEntity);
  }
}
