import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/mysql';
import { MikroOrmConfig } from './mikro-orm.config';

async function bootstrap() {
  const orm = await MikroORM.init(MikroOrmConfig);
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
