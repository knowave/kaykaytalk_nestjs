import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useValidationPipe(app);

  await app.listen(3000);

  function useValidationPipe(app: INestApplication): void {
    const pipe = new ValidationPipe();
    app.useGlobalPipes(pipe);
  }
}
bootstrap();
