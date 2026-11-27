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
    // TypeORM interpreta las fechas de MySQL en UTC.
    timezone: 'Z',
    entities,
    // TypeORM sincroniza el esquema si DB_SYNC está activado.
    synchronize: process.env.DB_SYNC === 'true',
  };
}
