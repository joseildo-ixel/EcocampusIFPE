import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres', // Altere para 'mysql' se estiver usando MySQL
  host: 'localhost',
  port: 5432,
  username: 'seu_usuario', 
  password: 'sua_senha',
  database: 'ecocampus',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});