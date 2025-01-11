import type { HttpStatus } from '@nestjs/common';
import { HttpStatusInfo } from '../constant/api-response.const';

export class ApiResponse<T> {
    private _code: number;
    private _message: string;
    private _data: T | null;

    private constructor(code: number, message: string, data: T | null = null) {
        this._code = code;
        this._message = message;
        this._data = data;
    }
    static of<T>(code: HttpStatus, data: T | null = null): ApiResponse<T> {
        const message = HttpStatusInfo[code as keyof typeof HttpStatusInfo] || 'unknown';
        return new ApiResponse<T>(code, message, data);
    }

    get code(): number {
        return this._code;
    }

    get message(): string {
        return this._message;
    }

    get data(): T | null {
        return this._data;
    }

    toJSON() {
        return {
            code: this._code,
            message: this._message,
            data: this._data,
        };
    }
}
