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
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus: number
    let message: string
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "Internal Server Error";
      console.log(exception);
    }

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
      responseBody.data = new BadRequestException('Bad Request Exception', exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}