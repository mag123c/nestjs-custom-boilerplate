import { DataSource, QueryRunner } from 'typeorm';

export class QueryManager {
    constructor(private readonly dataSource: DataSource) {}

    async getConnection(): Promise<QueryRunner> {
        return this.dataSource.createQueryRunner();
    }

    async setCharsetAndCollation(): Promise<QueryRunner> {
        const connection = this.dataSource.createQueryRunner();
        await connection.query('SET NAMES utf8mb4');
        await connection.query('SET CHARACTER SET utf8mb4');
        await connection.query('SET character_set_connection=utf8mb4');
        await connection.query('SET collation_connection=utf8mb4_unicode_ci');

        return connection;
    }

    async execute(query: string, params: any[], connection: QueryRunner): Promise<any[]> {
        try {
            return await connection.query(query, params);
        } finally {
            await connection.release();
        }
    }
}
