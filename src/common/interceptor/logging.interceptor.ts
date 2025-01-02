import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { BaseException } from '../exception/base.exception';
import { ExceptionFormatFactory } from '../exception/factory/exception.factory';
import { LoggingManager } from '../helper/logging.manager';
import { WarnManager } from '../helper/warn.manager';
import { isStaging } from '../util/env.util';
import { koreaTimeString } from '../util/moment.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly loggingManager: LoggingManager;

    constructor() {
        const warnManager = new WarnManager(5, 60000);
        this.loggingManager = new LoggingManager(warnManager);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = Date.now();

        const request = context.switchToHttp().getRequest();
        const { method, url, user, body } = request;
        const referer = request.headers?.referer ?? undefined;

        return next.handle().pipe(
            tap(() => {
                const duration = `${Date.now() - startTime}ms`;

                // 요청 로깅
                this.loggingManager.logRequest(method, url, duration, user);
            }),

            catchError((error) => {
                const duration = `${Date.now() - startTime}ms`;

                const errorFormat = ExceptionFormatFactory.of(error);

                const logContext = {
                    method,
                    url,
                    duration,
                    referer,
                    timestamp: koreaTimeString(),
                    stack: isStaging() ? error.stack : undefined,
                    body: body ?? undefined,
                    statusCode: errorFormat.statusCode ?? error?.status ?? 500,
                };

                //Warn 로깅
                if (error instanceof BaseException) {
                    this.loggingManager.logWarn(url, error, logContext, user);
                }
                //Error 로깅
                else {
                    this.loggingManager.logError(error, logContext, user);
                }

                return throwError(() => error);
            }),
        );
    }
}
