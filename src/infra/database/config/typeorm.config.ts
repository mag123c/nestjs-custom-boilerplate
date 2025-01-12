import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { isLocal, isTest } from '../../../common/util/env.util';

export const typeORMConfig = (configService: ConfigService) => {
    const host = configService.get<string>('DATABASE_HOST');

    if (!isLocal() && !isTest() && (host === 'localhost' || host === '127.0.0.1')) {
        throw new Error('[Database] Database host is not allowed');
    }

    return {
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: isLocal() || isTest(),
        logging: true,
        namingStrategy: new SnakeNamingStrategy(),
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    } as TypeOrmModuleAsyncOptions;
};
