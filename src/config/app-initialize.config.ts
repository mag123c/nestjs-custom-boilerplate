import type { INestApplication } from '@nestjs/common';
import compression from 'compression';
import { setupCors } from './cors.config';
import { setupPipe } from './global-pipe.config';
import { setupSwagger } from './swagger.config';

export const setupAppConfig = async (app: INestApplication) => {
    //Res compression -> network resource ↓
    app.use(compression());

    //Trusted Proxy
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', true);

    setupCors(app);
    setupPipe(app);
    setupSwagger(app);
};
