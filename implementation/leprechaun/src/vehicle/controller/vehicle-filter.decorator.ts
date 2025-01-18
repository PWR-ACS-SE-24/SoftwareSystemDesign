import { EscapedRegExpLike, ForceArrayToHaveNamedApiQueryOf, removeOffendingFields } from '@app/shared/api/filter';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Request } from 'express';

export class VehicleFilterOptions {
  @IsOptional()
  @IsString()
  @MaxLength(16)
  vehicleSideNumberLike?: string;
}

export const VehicleFilter = () => {
  return createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
      const request: Request = context.switchToHttp().getRequest();

      return removeOffendingFields<VehicleFilterOptions>(request.query, VehicleFilterOptions);
    },
    [
      (target: Object, key: string | symbol | undefined) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key!);
        if (!propertyDescriptor || !key) throw new Error('Invalid key of target');

        const decorators: ForceArrayToHaveNamedApiQueryOf<VehicleFilterOptions> = [
          {
            name: 'vehicleSideNumberLike',
            required: false,
            type: 'string',
            description: 'Filter by vehicle side number like',
            example: '123',
          },
        ];

        decorators.map((config) => ApiQuery(config)(target, key, propertyDescriptor));
      },
    ],
  )();
};

export const filterForVehicleSideNumberLike = (value: string | undefined) => {
  return value ? { sideNumber: EscapedRegExpLike(value) } : {};
};
