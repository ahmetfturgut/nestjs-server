import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiException } from 'src/app/_common/api/api.exeptions';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;


    const message = exception instanceof HttpException
      ? exception.message
      : "Internal Server Error";

    const apiError = exception instanceof ApiException;

    const responseBody = {
      httpStatus,
      message,
      timestamp: new Date().toISOString(),
      apiError,
      apiErrorCode: undefined,
      data: undefined
    };

    if (apiError) {
      responseBody.apiErrorCode = exception.getApiErrorCode();
      responseBody.data = exception.getData();
    } else if (httpStatus == HttpStatus.BAD_REQUEST) {
      // Todo
      responseBody.data = new BadRequestException('Bad Request Exception', exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}