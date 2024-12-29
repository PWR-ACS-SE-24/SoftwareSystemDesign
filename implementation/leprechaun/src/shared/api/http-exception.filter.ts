import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpException, InternalServerError } from './http-exceptions';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.code).json(exception);
  }
}

@Catch()
export class InternalExceptionFilter<T extends Error> implements ExceptionFilter {
  private readonly logger = new Logger(InternalExceptionFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.fatal(exception.message, exception.stack);

    response.status(500).json(new InternalServerError());
  }
}
