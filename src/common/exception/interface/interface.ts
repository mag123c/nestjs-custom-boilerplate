export interface IExceptionResponse {
    code: number;
    message: string;
    path?: string;
    stack?: string;
    sql?: string;
    sqlMessage?: string;
}
