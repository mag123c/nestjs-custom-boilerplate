import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();

        return next.handle().pipe(
            map((data) => {
                // 2XX 응답값 설정
                if (data === undefined || data === null) {
                    return {
                        statusCode: response.statusCode,
                        success: true,
                    };
                }
                return data;
            }),
        );
    }
}
