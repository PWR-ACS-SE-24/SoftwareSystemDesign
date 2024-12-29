import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

enum ErrorKind {
  SchemaMismatchException = 'schema-mismatch-exception',
  NotFoundException = 'resource-not-found-exception',
  InternalServerError = 'internal-server-error',
}

interface AppError {
  kind: ErrorKind;
  code: number;
  messageEn: string;
  messagePl?: string;
}

export class HttpExceptionDto implements AppError {
  @ApiProperty({ description: 'Error kind', enum: ErrorKind, isArray: false })
  kind: ErrorKind;
  @ApiProperty({ description: 'HTTP status code' })
  code: number;
  @ApiProperty({ description: 'Error message in English' })
  messageEn: string;
  @ApiProperty({ description: 'Error message in Polish', required: false })
  messagePl?: string;

  constructor(kind: ErrorKind, code: number, messageEn: string, messagePl: string) {
    this.kind = kind;
    this.code = code;
    this.messageEn = messageEn;
    this.messagePl = messagePl;
  }
}
export class SchemaMismatchException extends HttpException {
  constructor() {
    super('Schema mismatch exception', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

// Typical HTTP exceptions
export const exceptionMap = {
  SchemaMismatchException: () =>
    new HttpExceptionDto(
      ErrorKind.SchemaMismatchException,
      HttpStatus.UNPROCESSABLE_ENTITY,
      'Schema mismatch exception',
      'Niezgodność schematu',
    ),
  NotFoundException: (id: any) => {
    const messageEn = typeof id === 'string' ? `Resource with id {${id}} not found.` : `Resource not found.`;
    const messagePl = typeof id === 'string' ? `Nie znaleziono zasobu o id {${id}}.` : `Nie znaleziono zasobu.`;
    return new HttpExceptionDto(ErrorKind.NotFoundException, HttpStatus.NOT_FOUND, messageEn, messagePl);
  },
  InternalServerError: () =>
    new HttpExceptionDto(
      ErrorKind.InternalServerError,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
      'Wewnętrzny błąd serwera',
    ),
};

export function mapException<T extends HttpException>(error: T): AppError {
  try {
    return exceptionMap[error.constructor.name](error.getResponse());
  } catch (e) {
    return exceptionMap.InternalServerError();
  }
}
