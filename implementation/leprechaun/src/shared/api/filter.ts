import { Type } from '@nestjs/common';
import { ApiQueryOptions } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

// TODO: there is a way to force TypeScript to check if the array of objects matches EXACTLY the interface
// source? came up in a dream
export type ForceArrayToHaveNamedApiQueryOf<T extends {}> = Array<{ name: keyof T } & ApiQueryOptions>;

// NOTE: Query params should be soft-validated, if they are ok then they are passed to the decorator, otherwise no
//       exception should be thrown, and offending fields should be removed. class-validator alone is not enough
//       thus the removeOffendingFields function
export function removeOffendingFields<T extends {}>(data: T, type: Type<T>): T {
  const obj = plainToInstance(type, data);
  const copy = { ...data };
  validateSync(obj, {
    whitelist: true, // remove unknown properties
    skipMissingProperties: true, // allow missing properties
    forbidUnknownValues: true, // remove unknown values
    forbidNonWhitelisted: true, // remove non-whitelisted properties
    stopAtFirstError: false, // continue validation after first error
  }).map((error) => delete copy[error.property as keyof T]);
  return copy;
}

// https://www.30secondsofcode.org/js/s/escape-reg-exp/
export const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const EscapedRegExpLike = (str: string) => RegExp(escapeRegExp(str));
