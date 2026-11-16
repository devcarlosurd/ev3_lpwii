import { DataSourceOptions } from 'typeorm';
import { entities } from './entities';

export function databaseOptions(): DataSourceOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USER || 'gamehub',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'gamehub',
    timezone: 'Z',
    entities,
    synchronize: process.env.DB_SYNC === 'true',
  };
}
