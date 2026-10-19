import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database/database.config';
import { ObjetosModule } from './objetos/objetos.module';
import { ColetorModule } from './coletor/coletor.module';
import { UsuariosModule } from './usuario/usuarios.module';
import { DescarteModule } from './Descarte/descarte.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UsuariosModule,
    ObjetosModule,
    ColetorModule,
    DescarteModule,
  ],
})
export class AppModule {}