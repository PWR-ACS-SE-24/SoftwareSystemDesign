import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { HttpExceptionDto } from './http-exceptions';

export const ApiInvalidSchema = (overrides: ApiResponseOptions) => {
  return applyDecorators(
    ApiResponse({ ...overrides, status: HttpStatus.UNPROCESSABLE_ENTITY, type: HttpExceptionDto }),
  );
};
