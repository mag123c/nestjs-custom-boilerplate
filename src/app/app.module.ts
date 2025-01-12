import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, BaseExceptionFilter } from '@nestjs/core';
import { LoggingInterceptor } from '../common/interceptor/logging.interceptor';
import { envConfig } from '../config/env.config';
import { DatabaseModule } from '../infra/database/database.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module.ts';

@Module({
    imports: [
        ConfigModule.forRoot({
            ...envConfig(),
        }),
        DatabaseModule,
        UserModule,
        PostModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: BaseExceptionFilter,
        },
    ],
})
export class AppModule {}
