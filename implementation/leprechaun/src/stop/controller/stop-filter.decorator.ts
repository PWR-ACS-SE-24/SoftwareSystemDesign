import { EscapedRegExpLike, ForceArrayToHaveNamedApiQueryOf, removeOffendingFields } from '@app/shared/api/filter';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Request } from 'express';

export class StopFilterOptions {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  stopNameLike?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  lineNameLike?: string;
}

export const StopFilter = () =>
  createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
      const request: Request = context.switchToHttp().getRequest();

      return removeOffendingFields<StopFilterOptions>(request.query, StopFilterOptions);
    },
    [
      (target: Object, key: string | symbol | undefined) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key!);
        if (!propertyDescriptor || !key) throw new Error('Invalid key of target');

        const decorators: ForceArrayToHaveNamedApiQueryOf<StopFilterOptions> = [
          {
            name: 'stopNameLike',
            required: false,
            type: 'string',
            description: 'Filter by stop name like',
            example: 'pl. G',
          },
          {
            name: 'lineNameLike',
            required: false,
            type: 'string',
            description: 'Filter by line name like',
            example: 'M',
          },
        ];

        decorators.map((config) => ApiQuery(config)(target, key, propertyDescriptor));
      },
    ],
  )();

export const filterForStopNameLike = (value: string | undefined) => {
  return value ? { name: EscapedRegExpLike(value) } : {};
};
export const filterForLineNameLike = (value: string | undefined) => {
  return value ? { mappings: { line: { name: EscapedRegExpLike(value) } } } : {};
};
