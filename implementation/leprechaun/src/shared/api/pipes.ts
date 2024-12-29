import { ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
import { SchemaMismatchException } from './http-exceptions';

export const UUIDPipe = new ParseUUIDPipe({
  version: '7',
  exceptionFactory: () => new SchemaMismatchException(),
});

export const ValidateCreatePipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: () => new SchemaMismatchException(),
});

export const ValidateUpdatePipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  skipMissingProperties: true,
  exceptionFactory: () => new SchemaMismatchException(),
});
