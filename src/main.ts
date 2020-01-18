import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import {ValidationError, ValidationPipe} from '@nestjs/common';
import ValidationException from './exceptions/ValidationException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => new ValidationException(errors),
    validateCustomDecorators: true,
    transform: true,
    whitelist: true,
  }));
  await app.listen(3000);
}
bootstrap();
