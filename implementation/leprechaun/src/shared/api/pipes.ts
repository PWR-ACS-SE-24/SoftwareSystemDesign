import { ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
import { SchemaMismatchException } from './http-exceptions';

export const UUIDPipe = new ParseUUIDPipe({
  version: '7',
  exceptionFactory: (_) => new SchemaMismatchException('Invalid UUID format'),
});

export const ValidateCreatePipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (_) => new SchemaMismatchException('Invalid create object format'),
});

export const ValidateUpdatePipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  skipMissingProperties: true,
  exceptionFactory: (_) => new SchemaMismatchException('Invalid update object format'),
});
