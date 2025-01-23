import { EscapedRegExpLike, ForceArrayToHaveNamedApiQueryOf, removeOffendingFields } from '@app/shared/api/filter';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery, PickType } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';
import { Request } from 'express';

class RouteFilterDto {
  @IsOptional()
  @IsString()
  @MaxLength(4)
  lineNameLike?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  stopNameLike?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  vehicleSideNumberLike?: string;

  @IsOptional()
  @IsString()
  @IsISO8601()
  startTimeAfter?: string;

  @IsOptional()
  @IsString()
  @IsISO8601()
  startTimeBefore?: string;

  @IsOptional()
  @IsString()
  @IsISO8601()
  endTimeAfter?: string;

  @IsOptional()
  @IsString()
  @IsISO8601()
  endTimeBefore?: string;
}

export class RouteFilterOptions extends PickType(RouteFilterDto, [
  'lineNameLike',
  'stopNameLike',
  'vehicleSideNumberLike',
] as const) {
  startTimeAfter?: Date;
  startTimeBefore?: Date;
  endTimeAfter?: Date;
  endTimeBefore?: Date;
}

export const RouteFilter = () =>
  createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
      const request: Request = context.switchToHttp().getRequest();

      const obj = removeOffendingFields<RouteFilterDto>(request.query, RouteFilterDto);
      // prettier-ignore
      return <RouteFilterOptions>{
        ...obj,
        startTimeAfter:  obj.startTimeAfter  ? new Date(obj.startTimeAfter)  : undefined,
        startTimeBefore: obj.startTimeBefore ? new Date(obj.startTimeBefore) : undefined,
        endTimeAfter:    obj.endTimeAfter    ? new Date(obj.endTimeAfter)    : undefined,
        endTimeBefore:   obj.endTimeBefore   ? new Date(obj.endTimeBefore)   : undefined,
      };
    },
    [
      (target: Object, key: string | symbol | undefined) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key!);
        if (!propertyDescriptor || !key) throw new Error('Invalid key of target');

        const decorators: ForceArrayToHaveNamedApiQueryOf<RouteFilterDto> = [
          {
            name: 'lineNameLike',
            required: false,
            type: 'string',
            description: 'Filter by line name like',
            example: 'M',
          },
          {
            name: 'stopNameLike',
            required: false,
            type: 'string',
            description: 'Filter by line that contains stop name like',
            example: 'pl. G',
          },
          {
            name: 'vehicleSideNumberLike',
            required: false,
            type: 'string',
            description: 'Filter by vehicle side number like',
            example: '1234',
          },
          {
            name: 'startTimeAfter',
            required: false,
            type: 'string',
            format: 'date-time',
            description: 'Filter by route start time after',
            example: '2021-07-29T08:00:00.000Z',
          },
          {
            name: 'startTimeBefore',
            required: false,
            type: 'string',
            format: 'date-time',
            description: 'Filter by route start time before',
            example: '2021-07-29T08:00:00.000Z',
          },
          {
            name: 'endTimeAfter',
            required: false,
            type: 'string',
            format: 'date-time',
            description: 'Filter by route end time after',
            example: '2021-07-29T08:00:00.000Z',
          },
          {
            name: 'endTimeBefore',
            required: false,
            type: 'string',
            format: 'date-time',
            description: 'Filter by route end time before',
            example: '2021-07-29T08:00:00.000Z',
          },
        ];

        decorators.map((config) => ApiQuery(config)(target, key, propertyDescriptor));
      },
    ],
  )();

export const filterForLineNameLike = (value: string | undefined) => {
  return value ? { line: { name: EscapedRegExpLike(value) } } : {};
};
export const filterForStopNameLike = (value: string | undefined) => {
  return value ? { line: { mappings: { stop: { name: EscapedRegExpLike(value) } } } } : {};
};
export const filterForVehicleSideNumberLike = (value: string | undefined) => {
  return value ? { vehicle: { sideNumber: EscapedRegExpLike(value) } } : {};
};
export const filterForStartTimeAfter = (value: Date | undefined) => {
  return value ? { startTime: { $gte: value } } : {};
};
export const filterForStartTimeBefore = (value: Date | undefined) => {
  return value ? { startTime: { $lte: value } } : {};
};
export const filterForEndTimeAfter = (value: Date | undefined) => {
  return value ? { endTime: { $gte: value } } : {};
};
export const filterForEndTimeBefore = (value: Date | undefined) => {
  return value ? { endTime: { $lte: value } } : {};
};
