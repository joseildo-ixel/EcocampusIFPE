import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjetosModule } from './objetos/objetos.module';
import { ColetorModule } from './coletor/coletor.module';
import { UsuariosModule } from './usuario/usuarios.module';
import { ColetaModule } from './coleta/coleta.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ecocampus',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ObjetosModule,
    ColetorModule,
    UsuariosModule,
    ColetaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}