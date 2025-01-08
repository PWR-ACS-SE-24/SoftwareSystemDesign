import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { exceptionMap, mapException } from './http-exceptions';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const exceptionObject = mapException(exception);
    response.status(exceptionObject.code).json(exceptionObject);
  }
}

@Catch()
export class InternalExceptionFilter<T extends Error> implements ExceptionFilter {
  private readonly logger = new Logger(InternalExceptionFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.fatal(exception.message, exception.stack);

    const exceptionObject = exceptionMap.InternalServerError('');
    response.status(exceptionObject.code).json(exceptionObject);
  }
}
