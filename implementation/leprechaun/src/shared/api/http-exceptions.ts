import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const ErrorKind: Record<string, [string, number]> = {
  SchemaMismatchException: ['schema-mismatch-exception', HttpStatus.UNPROCESSABLE_ENTITY],
  NotFoundException: ['resource-not-found-exception', HttpStatus.NOT_FOUND],
  InternalServerError: ['internal-server-error', HttpStatus.INTERNAL_SERVER_ERROR],
} as const;

type Values<Object> = Object[keyof Object];
type Keys<Object> = keyof Object;

interface AppError {
  kind: string;
  code: number;
  messageEn: string;
  messagePl?: string;
}

export class HttpExceptionDto implements AppError {
  @ApiProperty({ description: 'Error kind', enum: () => Object.values(ErrorKind), isArray: false })
  kind: string;
  @ApiProperty({ description: 'HTTP status code' })
  code: number;
  @ApiProperty({ description: 'Error message in English' })
  messageEn: string;
  @ApiProperty({ description: 'Error message in Polish', required: false })
  messagePl?: string;

  constructor([kind, code]: Values<typeof ErrorKind>, messageEn: string, messagePl: string) {
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
export const exceptionMap: Record<Keys<typeof ErrorKind>, (...message: Array<unknown>) => HttpExceptionDto> = {
  SchemaMismatchException: (_) =>
    new HttpExceptionDto(ErrorKind.SchemaMismatchException, 'Schema mismatch exception', 'Niezgodność schematu'),
  NotFoundException: (id: unknown) => {
    const messageEn = typeof id === 'string' ? `Resource with id {${id}} not found.` : `Resource not found.`;
    const messagePl = typeof id === 'string' ? `Nie znaleziono zasobu o id {${id}}.` : `Nie znaleziono zasobu.`;
    return new HttpExceptionDto(ErrorKind.NotFoundException, messageEn, messagePl);
  },
  InternalServerError: (_) =>
    new HttpExceptionDto(ErrorKind.InternalServerError, 'Internal server error', 'Wewnętrzny błąd serwera'),
};

export function mapException<T extends HttpException>(error: T): AppError {
  try {
    return exceptionMap[error.constructor.name](error.getResponse());
  } catch {
    return exceptionMap.InternalServerError();
  }
}
