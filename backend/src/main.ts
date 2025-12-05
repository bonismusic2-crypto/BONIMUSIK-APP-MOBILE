import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Increase body limit for large file uploads (audio/video)
    app.use(json({ limit: '500mb' }));
    app.use(urlencoded({ extended: true, limit: '500mb' }));

    // Enable CORS for admin dashboard
    app.enableCors({
        origin: true,
        credentials: true,
    });

    await app.listen(3000, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
