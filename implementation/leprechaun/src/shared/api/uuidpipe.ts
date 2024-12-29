import { ParseUUIDPipe } from '@nestjs/common';
import { SchemaMismatchException } from './http-exceptions';

export const UUIDPipe = new ParseUUIDPipe({
  version: '7',
  exceptionFactory: () => new SchemaMismatchException(),
});
