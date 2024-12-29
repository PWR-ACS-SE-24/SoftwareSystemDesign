import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { SchemaMismatchException } from './http-exceptions';

@Injectable()
export class ValidationService {
  // We could possible redo this as validation-pipe, CreateObjectValidationPipe and PatchObjectValidationPipe
  async validate<T extends object>(obj: T, update: boolean = false): Promise<void> {
    const errors = await validate(obj, { whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: update });
    if (errors.length > 0) {
      throw new SchemaMismatchException();
    }
  }
}
