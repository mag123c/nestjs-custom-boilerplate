import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { isLocal, isTest } from '../common/util/env.util';

const getLogLevel = (): string => {
    if (!isTest()) {
        if (!isLocal()) {
            return 'http';
        } else {
            return 'silly';
        }
    }
    return 'warn';
};

const consoleTransport = new winston.transports.Console({
    level: getLogLevel(),
    format: winston.format.combine(
        winston.format.colorize(),
        utilities.format.nestLike(process.env.NODE_ENV, {
            colors: true,
            prettyPrint: true,
        }),
        winston.format.printf(({ level, message, ...meta }) => {
            const errorMessage = meta?.stack ? JSON.stringify(meta?.stack, null, 2) : '';
            const logMessage = `${Date.now()} [${level}] ${message}`;
            return errorMessage ? `${logMessage} \n ${errorMessage}` : logMessage;
        }),
    ),
});

const transports: any[] = [consoleTransport];

const WinstonLogger = WinstonModule.createLogger({
    transports,
});

export default WinstonLogger;
