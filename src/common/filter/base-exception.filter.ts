import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../exception/base.exception';
import { IExceptionResponse } from '../exception/interface/interface';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
    catch(exception: BaseException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();
        const httpCode = exception.status;
        const status = `${exception.status}${exception.code}`;
        const stack = exception.stack;

        // if (가드레이어의 에러의 경우 Interceptor을 거치지 않으므로 로깅 처리 필요) {
        //     this.logWarn(exception, request);
        // }

        const json: IExceptionResponse = {
            code: +status,
            message: exception.message,
        };

        if (process.env.NODE_ENV !== 'production') {
            json['path'] = request.url;
            json['stack'] = stack;

            if (exception.sql) {
                json['sql'] = exception.sql;
                json['sqlMessage'] = exception.sqlMessage;
            }
        }

        response.status(httpCode).json(json);
    }
}
