import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupAppConfig } from './config/app-initialize.config';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });

    setupAppConfig(app);

    await app
        .listen(process.env.PORT || 5555)
        .then(() => {
            logger.log(`Server is running on ${process.env.PORT || 5555}`);
            if (typeof (process as any).send === 'function') {
                (process as any).send('ready');
                console.log(`[Worker ${process.pid}] Sent ready signal to PM2`);
                console.log(`[Worker ${process.pid}] Running with PM2.`);
            } else {
                console.log(`[Worker ${process.pid}] Running without PM2.`);
            }
        })
        .catch((e) => logger.error(e));

    process.on('SIGINT', () => {
        logger.warn('SIGINT signal received.');
        app.close()
            .then(() => {
                logger.log('Server closed.');
                process.exit(0);
            })
            .catch((e) => logger.error(e));
    });
}
bootstrap();
