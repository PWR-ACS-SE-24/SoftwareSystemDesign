// import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

interface AppError {
  kind: string;
  code: number;
  messageEn: string;
  messagePl?: string;
}

export class HttpException extends Error implements AppError {
  @ApiProperty({ description: 'Error kind' })
  kind: string;
  @ApiProperty({ description: 'HTTP status code' })
  code: number;
  @ApiProperty({ description: 'Error message in English' })
  messageEn: string;
  @ApiProperty({ description: 'Error message in Polish', required: false })
  messagePl?: string;

  get message(): string {
    return this.kind;
  }

  constructor() {
    super();
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

export class InternalServerError extends HttpException {
  kind: string = 'internal-server-error';
  code: number = 500;
  messageEn: string = 'Internal server error';
  messagePl: string = 'Wewnętrzny błąd serwera';

  constructor() {
    super();
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class ResourceNotFoundException extends HttpException {
  kind: string = 'resource-not-found';
  code: number = 404;
  messageEn: string;
  messagePl?: string;

  constructor(id: string) {
    super();
    Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
    this.messageEn = `Resource with id ${id} not found`;
    this.messagePl = `Nie znaleziono zasobu o id ${id}`;
  }
}

export class SchemaMismatchException extends HttpException {
  kind: string = 'schema-mismatch';
  code: number = 422;
  messageEn: string = 'The request data did not align with the schema.';
  messagePl: string = 'Dane zapytania nie zgadzają się ze schematem.';

  constructor() {
    super();
    Object.setPrototypeOf(this, SchemaMismatchException.prototype);
  }
}
