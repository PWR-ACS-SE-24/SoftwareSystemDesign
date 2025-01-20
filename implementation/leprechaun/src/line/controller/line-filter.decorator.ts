import { EscapedRegExpLike, ForceArrayToHaveNamedApiQueryOf, removeOffendingFields } from '@app/shared/api/filter';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Request } from 'express';

export class LineFilterOptions {
  @IsOptional()
  @IsString()
  @MaxLength(4)
  lineNameLike?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  stopNameLike?: string;
}

export const LineFilter = () =>
  createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
      const request: Request = context.switchToHttp().getRequest();

      return removeOffendingFields<LineFilterOptions>(request.query, LineFilterOptions);
    },
    [
      (target: Object, key: string | symbol | undefined) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key!);
        if (!propertyDescriptor || !key) throw new Error('Invalid key of target');

        const decorators: ForceArrayToHaveNamedApiQueryOf<LineFilterOptions> = [
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
        ];

        decorators.map((config) => ApiQuery(config)(target, key, propertyDescriptor));
      },
    ],
  )();

// BUG? 'mappings.stop.name' does not raise any problems in the code but when searching MikroORM poops itself with
// `missing FROM-clause entry for table "stop"` error
export const filterForStopNameLike = (value: string | undefined) => {
  return value ? { mappings: { stop: { name: EscapedRegExpLike(value) } } } : {};
};

export const filterForLineNameLike = (value: string | undefined) => {
  return value ? { name: EscapedRegExpLike(value) } : {};
};
