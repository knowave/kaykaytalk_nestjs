import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

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
        autoLoadEntities: true,
        schemaGenerator: {
          disableForeignKeys: true,
          createForeignKeyConstraints: true,
          ignoreSchema: [],
        },
        entities: [path.join(__dirname, '../**/entities/**/*.entity.{ts,js}')],
        entitiesTs: [path.join('../**/entities/**/*.entity.{ts,js}')],
        migrations: {
          path: path.join(__dirname, './migrations/*.ts'),
          tableName: 'migrations',
          transactional: true,
        },
      }),
    }),
  ],
})
export class MysqlModule {}
