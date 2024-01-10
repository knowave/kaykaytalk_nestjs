import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import * as path from 'path';

export const MikroOrmConfig: Options = {
  driver: MySqlDriver,
  host: process.env.DB_HOST,
  port: 5432,
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
