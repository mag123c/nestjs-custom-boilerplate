function initializeException(
    exception: BaseException,
    status: number,
    code: string,
    sql?: string,
    sqlMessage?: string,
) {
    exception.status = status;
    exception.code = code;

    if (sql) {
        exception.sql = sql;
    }
    if (sqlMessage) {
        exception.sqlMessage = sqlMessage;
    }

    Object.setPrototypeOf(exception, Object.getPrototypeOf(exception));
    Error.captureStackTrace(exception, exception.constructor);
}

export class BaseException extends Error {
    public status!: number;
    public code!: string;
    public sql?: string;
    public sqlMessage?: string;

    constructor(status: number, code: string, message: string, sql?: string, sqlMessage?: string) {
        super(message);
        this.name = this.constructor.name;
        initializeException(this, status, code, sql, sqlMessage);
    }
}
