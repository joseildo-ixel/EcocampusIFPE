import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Descarte } from '../Descarte/entities/descarte.entity';
import { Coletor } from '../coletor/entities/coletor.entity';
import { DescarteItem } from '../objetos/entities/descarte-item.entity';
import { Objeto } from '../objetos/entities/objeto.entity';
import { CompleteDomainSchema1000000000001 } from '../migrations/1000000000001-CompleteDomainSchema';
import { CreateTables1000000000000 } from '../migrations/1000000000000-CreateTables';
import { PreserveDisposalHistory1000000000002 } from '../migrations/1000000000002-PreserveDisposalHistory';
import { Usuario } from '../usuario/entities/usuario.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'senha123',
  database: process.env.DB_NAME || 'ecocampus',
  entities: [Usuario, Objeto, Coletor, Descarte, DescarteItem],
  migrations: [
    CreateTables1000000000000,
    CompleteDomainSchema1000000000001,
    PreserveDisposalHistory1000000000002,
  ],
  migrationsRun: true,
  synchronize: false,
  logging: true,
};