import { EscapedRegExpLike, ForceArrayToHaveNamedApiQueryOf, removeOffendingFields } from '@app/shared/api/filter';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery, PickType } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';
import { Request } from 'express';

class AccidentFilterDto {
  @IsOptional()
  @IsString()
  @MaxLength(4)
  lineNameLike?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  vehicleSideNumberLike?: string;

  @IsOptional()
  @IsString()
  @IsISO8601()
  startTime?: string;

  @IsOptional()
  @IsString()
  @IsISO8601()
  endTime?: string;
}

export class AccidentFilterOptions extends PickType(AccidentFilterDto, [
  'lineNameLike',
  'vehicleSideNumberLike',
] as const) {
  startTime?: Date;
  endTime?: Date;
}

export const AccidentFilter = () =>
  createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
      const request: Request = context.switchToHttp().getRequest();

      const obj = removeOffendingFields<AccidentFilterDto>(request.query, AccidentFilterDto);
      // prettier-ignore
      return <AccidentFilterOptions>{
        ...obj,
        startTime: obj.startTime ? new Date(obj.startTime) : undefined,
        endTime:   obj.endTime   ? new Date(obj.endTime)   : undefined,
      };
    },
    [
      (target: Object, key: string | symbol | undefined) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key!);
        if (!propertyDescriptor || !key) throw new Error('Invalid key of target');

        const decorators: ForceArrayToHaveNamedApiQueryOf<AccidentFilterDto> = [
          {
            name: 'lineNameLike',
            required: false,
            type: 'string',
            description: 'Filter by line name like',
            example: 'M',
          },
          {
            name: 'vehicleSideNumberLike',
            required: false,
            type: 'string',
            description: 'Filter by vehicle side number like',
            example: '123',
          },
          {
            name: 'startTime',
            required: false,
            type: 'string',
            format: 'date-time',
            example: '2021-07-29T08:00:00.000Z',
            description: 'Filter by start date-time later than',
          },
          {
            name: 'endTime',
            required: false,
            type: 'string',
            format: 'date-time',
            example: '2021-07-29T08:00:00.000Z',
            description: 'Filter by end date-time earlier than',
          },
        ];

        decorators.map((config) => ApiQuery(config)(target, key, propertyDescriptor));
      },
    ],
  )();

export const filterForVehicleSideNumberLike = (value: string | undefined) => {
  return value ? { route: { vehicle: { sideNumber: EscapedRegExpLike(value) } } } : {};
};
export const filterForLineNameLike = (value: string | undefined) => {
  return value ? { route: { line: { name: EscapedRegExpLike(value) } } } : {};
};
export const filterForTimeAfter = (value: Date | undefined) => {
  return value ? { time: { $gte: value } } : {};
};
export const filterForTimeBefore = (value: Date | undefined) => {
  return value ? { time: { $lte: value } } : {};
};
