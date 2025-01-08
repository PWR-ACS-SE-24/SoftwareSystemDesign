import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export interface Pagination {
  page: number;
  size: number;
}

export const Paginated = (limitOverwrite = DEFAULT_LIMIT) =>
  createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();

      const page = parseInt(request.query.page, 10) || 0;
      const size = parseInt(request.query.size, 10) || limitOverwrite;

      return <Pagination>{
        page: Math.max(0, page),
        size: Math.min(MAX_LIMIT, Math.max(1, size)),
      };
    },
    [
      (target: Object, key: string | symbol | undefined) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key!);
        if (!propertyDescriptor || !key) throw new Error('Invalid key of target');

        ApiQuery({ name: 'page', type: Number, required: false, minimum: 0, default: 0, example: 0 })(
          target,
          key,
          propertyDescriptor,
        );
        ApiQuery({
          name: 'size',
          type: Number,
          required: false,
          minimum: 1,
          default: DEFAULT_LIMIT,
          maximum: MAX_LIMIT,
          example: 30,
        })(target, key, propertyDescriptor);
      },
    ],
  )();
