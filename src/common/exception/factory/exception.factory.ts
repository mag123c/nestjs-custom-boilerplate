import { koreaTimeString } from '../../util/moment.util';

export class ExceptionFormatFactory {
    status?: number;
    statusCode?: number;
    message?: string;
    ip?: string;
    stack?: string;
    timestamp?: string;
    path?: string;
    sql?: string;
    sqlMessage?: string;

    static of({ status, code, message, ip, stack, path, sql, sqlMessage }: any): ExceptionFormatFactory {
        const error = new ExceptionFormatFactory();
        error.status = status;
        error.statusCode = status && code ? +`${status}${code}` : status || 500;
        error.timestamp = koreaTimeString();
        error.message = message;
        error.ip = ip;
        error.stack = stack;
        error.path = path;
        error.sql = sql;
        error.sqlMessage = sqlMessage;
        return error;
    }
}
