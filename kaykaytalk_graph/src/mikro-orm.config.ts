import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const MikroOrmConfig: Options = {
  driver: MySqlDriver,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  allowGlobalContext: true,
  entities: [path.join(__dirname, '../**/entities/**/*.entity.{ts,js}')],
  entitiesTs: [path.join('../**/entities/**/*.entity.{ts,js}')],
  migrations: {
    path: path.join(__dirname, './migrations/*.ts'),
    tableName: 'migrations',
    transactional: true,
  },
};

export default MikroOrmConfig;
