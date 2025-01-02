import type { INestApplication } from '@nestjs/common';
import type { SwaggerCustomOptions } from '@nestjs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { isLocal } from '../common/util/env.util';

export const swaggerConfig = () => {
    return new DocumentBuilder()
        .setTitle('Campable Equipments API')
        .setDescription('캠퍼블 장비관리 API')
        .setVersion('alpha')
        .addTag('equipments', '장비')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                name: 'JWT',
                in: 'header',
            },
            'accessToken',
        )
        .build();
};

export const swaggerAuthConfig = () => {
    return expressBasicAuth({
        challenge: true,
        users: {
            [process.env.SWAGGER_USER as string]: process.env.SWAGGER_PASSWORD as string,
        },
    });
};

export const setupSwagger = (app: INestApplication) => {
    const document = SwaggerModule.createDocument(app, swaggerConfig());
    const swaggerOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            persistAuthorization: true,
            ui: true, // UI
            raw: false, // json, yaml falsy
        },
    };

    SwaggerModule.setup('/docs', app, document, swaggerOptions);

    if (!isLocal()) {
        app.use(['/docs'], swaggerAuthConfig());
    }
};