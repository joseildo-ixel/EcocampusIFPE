import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from './database/database.config';

// Keep CLI commands from applying migrations just by loading this data source.
export const AppDataSource = new DataSource({
  ...databaseConfig,
  migrationsRun: false,
} as DataSourceOptions);
