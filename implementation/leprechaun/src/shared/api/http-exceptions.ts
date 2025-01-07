import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const ErrorKind = {
  SchemaMismatchException: ['schema-mismatch-exception', HttpStatus.UNPROCESSABLE_ENTITY],
  NotFoundException: ['resource-not-found-exception', HttpStatus.NOT_FOUND],
  InternalServerError: ['internal-server-error', HttpStatus.INTERNAL_SERVER_ERROR],
} as const satisfies Record<string, [string, number]>;

function isKnownErrorType(key: string): key is keyof typeof ErrorKind {
  return key in exceptionMap;
}

type Values<Object> = Object[keyof Object];
type Keys<Object> = keyof Object;

interface AppError {
  kind: string;
  code: number;
  messageEn: string;
  messagePl?: string;
}

export class HttpExceptionDto implements AppError {
  @ApiProperty({ description: 'Error kind', enum: () => Object.values(ErrorKind).map((v) => v[0]), isArray: false })
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
  constructor(details: string) {
    super({ details }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export const exceptionMap: Record<
  Keys<typeof ErrorKind>,
  (response: string | Record<string, any>) => HttpExceptionDto
> = {
  SchemaMismatchException: (_) =>
    new HttpExceptionDto(ErrorKind.SchemaMismatchException, 'Schema mismatch exception', 'Niezgodność schematu'),

  NotFoundException: (message) => {
    let messageEn = 'Resource not found.';
    let messagePl = 'Nie znaleziono zasobu.';
    if (typeof message !== 'string' && 'details' in message) {
      messageEn = `Resource with id {${message.details}} not found.`;
      messagePl = `Nie znaleziono zasobu o id {${message.details}}.`;
    }
    return new HttpExceptionDto(ErrorKind.NotFoundException, messageEn, messagePl);
  },

  InternalServerError: (_) =>
    new HttpExceptionDto(ErrorKind.InternalServerError, 'Internal server error', 'Wewnętrzny błąd serwera'),
};

export function mapException<T extends HttpException>(error: T): AppError {
  const name = error.constructor.name;
  if (isKnownErrorType(name)) {
    return exceptionMap[name](error.getResponse());
  } else return exceptionMap.InternalServerError('');
}
