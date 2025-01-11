import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource, deleteDataSourceByName, getDataSourceByName } from 'typeorm-transactional';
import { typeORMConfig } from './config/typeorm.config';
import { QueryManager } from './manager/query.manager';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: typeORMConfig,
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error('[Database] TypeORM options is not provided');
                }

                if (process.env.NODE_ENV === 'test') {
                    deleteDataSourceByName('default');
                }

                return getDataSourceByName('default') || addTransactionalDataSource(new DataSource(options));
            },
        }),
    ],
    providers: [
        {
            provide: QueryManager,
            useFactory: (dataSource: DataSource) => new QueryManager(dataSource),
            inject: [DataSource],
        },
    ],
    exports: [QueryManager],
})
export class DatabaseModule {}
