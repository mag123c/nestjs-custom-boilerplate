import type { INestApplication } from '@nestjs/common';

export const setupCors = (app: INestApplication) => {
    //CORS, CREDENTIALS
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins: string[] = [];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`[CORS] Origin ${origin} not allowed`));
            }
        },
        credentials: true,
    });
};
