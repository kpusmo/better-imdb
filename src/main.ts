import {NestFactory} from '@nestjs/core';
import {AppModule} from './AppModule';
import {ValidationPipe} from '@nestjs/common';
import {validationExceptionFactory as exceptionFactory} from './exceptions/ValidationException';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory,
        validateCustomDecorators: true,
        transform: true,
        whitelist: true,
    }));
    await app.listen(3000);
}

bootstrap();
