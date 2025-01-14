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
  readonly startTime: string;

  @IsISO8601()
  @IsNotEmpty()
  @ApiProperty(endTimeProperty)
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
export class AccidentRouteDto extends GenericIdDto {
  @IsISO8601()
  @ApiProperty(startTimeProperty)
  readonly startTime: string;

  @IsISO8601()
  @ApiProperty(endTimeProperty)
  readonly endTime: string;

  @ApiProperty({ description: 'Name of the line', type: 'string', nullable: false, example: '141' })
  readonly lineName: string;

  @ApiProperty({ ...UUIDApiProperty, description: 'ID of the vehicle' })
  readonly line: string;

  @ApiProperty({ description: 'Side number of the vehicle', type: 'string', nullable: false, example: '2137' })
  readonly vehicleSideNumber: string;

  @ApiProperty({ ...UUIDApiProperty, description: 'ID of the vehicle' })
  readonly vehicle: string;

  constructor(
    id: string,
    startTime: Date,
    endTime: Date,
    lineName: string,
    line: string,
    vehicleSideNumber: string,
    vehicle: string,
  ) {
    super(id);
    this.startTime = startTime.toISOString();
    this.endTime = endTime.toISOString();
    this.lineName = lineName;
    this.line = line;
    this.vehicleSideNumber = vehicleSideNumber;
    this.vehicle = vehicle;
  }

  public static fromEntity(entity: Route): AccidentRouteDto {
    return new AccidentRouteDto(
      entity.id,
      entity.startTime,
      entity.endTime,
      entity.line.name,
      entity.line.id,
      entity.vehicle.sideNumber,
      entity.vehicle.id,
    );
  }

  public static fromEntities(entities: Route[]): AccidentRouteDto[] {
    return entities.map(AccidentRouteDto.fromEntity);
  }
}
