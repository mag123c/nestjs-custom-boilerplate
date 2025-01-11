import WinstonLogger from '../../config/winston.config';
import { isProduction, isStaging } from '../util/env.util';
import type { WarnManager } from './warn.manager';

interface LoggingContext {
    method: string;
    url: string;
    duration: string;
    referer?: string;
    timestamp: string;
    stack?: string;
    body?: string;
    statusCode?: number;
    user?: any;
}

export class LoggingManager {
    constructor(private readonly warnManager: WarnManager) {}

    logRequest(method: string, url: string, duration: string, user: any) {
        WinstonLogger.log({
            app: 'APP_NAME',
            env: process.env.NODE_ENV,
            level: 'info',
            message: `${method} ${url} ${duration}`,
            method,
            url,
            duration,
            user: user ?? undefined,
        });
    }

    logWarn(url: string, error: any, context: LoggingContext, user?: any) {
        const isThresholdExceeded = this.warnManager.increment(url);

        if (isThresholdExceeded) {
            // 웹훅전송필요시웹훅전송합수(웹훅인터페이스, {
            //     {
            //         statusCode: this.warnManager.threshold,
            //         message: `경고 로그 임계치 초과(${error.message})`,
            //         method: context.method,
            //         url: context.url,
            //         referer: context.referer ?? 'N/A',
            //         timestamp: context.timestamp,
            //         stack: context.stack,
            //         body: context.body,
            //     }
            // })
        }

        WinstonLogger.warn({
            app: 'APP_NAME',
            env: process.env.NODE_ENV,
            level: 'warn',
            message: `${context.method} ${context.url} ${context.duration} ${error.message}`,
            method: context.method,
            url: context.url,
            duration: context.duration,
            referer: context.referer,
            stack: context.stack,
            body: context.body,
            user: user ?? undefined,
        });
    }

    logError(error: any, context: LoggingContext, user?: any) {
        WinstonLogger.error({
            app: 'APP_NAME',
            env: process.env.NODE_ENV,
            level: 'error',
            message: `${context.method} ${context.url} ${context.duration} ${error.message}`,
            method: context.method,
            url: context.url,
            duration: context.duration,
            referer: context.referer,
            stack: context.stack,
            body: context.body,
            user: user ?? undefined,
        });

        if (isProduction() || isStaging()) {
            // 웹훅전송필요시웹훅전송합수(웹훅인터페이스, {
            //     statusCode: context.statusCode ?? 500,
            //     message: error.message,
            //     method: context.method,
            //     url: context.url,
            //     referer: context.referer ?? 'N/A',
            //     timestamp: context.timestamp,
            //     stack: context.stack,
            //     body: context.body,
            // });
        }
    }
}
