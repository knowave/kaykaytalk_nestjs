import { MySqlDriver } from '@mikro-orm/mysql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        driver: MySqlDriver,
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        user: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        dbName: configService.get('DB_NAME'),
        debug: true,
        schemaGenerator: {
          disableForeignKeys: true,
          createForeignKeyConstraints: true,
          ignoreSchema: [],
        },
        entities: ['../../**/entities/**/*.entity.{ts,js}'],
        entitiesTs: ['../../**/entities/**/*.entity.{ts,js}'],
        baseDir: __dirname,
        migrations: {
          path: './migrations/*.ts',
          tableName: 'migrations',
          transactional: true,
        },
      }),
    }),
  ],
})
export class MysqlModule {}
