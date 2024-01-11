import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import dotenv from 'dotenv';
dotenv.config();

export const MikroOrmConfig: Options = {
  driver: MySqlDriver,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
  allowGlobalContext: true,
  entities: ['./**/entities/**/*.entity.{ts,js}'],
  baseDir: __dirname,
  migrations: {
    path: './config/mysql/migrations/*.ts',
    tableName: 'migrations',
    transactional: true,
  },
};

export default MikroOrmConfig;
