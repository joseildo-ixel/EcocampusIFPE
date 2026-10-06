import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjetosModule } from './objetos/objetos.module';
import { ColetorModule } from './coletor/coletor.module';
import { UsuariosModule } from './usuario/usuarios.module';
import { ColetaModule } from './coleta/coleta.module';       // Importação adicionada
import { DescarteModule } from './descarte/descarte.module'; // Importação adicionada

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Altere para 'mysql' se estiverem usando MySQL
      host: 'localhost',
      port: 5432,
      username: 'seu_usuario',     // Substitua pelas credenciais locais
      password: 'sua_senha',       // Substitua pelas credenciais locais
      database: 'ecocampus',       // Nome do banco de dados criado
      autoLoadEntities: true,      // Carrega automaticamente as entidades dos módulos
      synchronize: false,          // Mantenha false para usar Migrations (exigência da rubrica)
    }),
    ObjetosModule, 
    ColetorModule, 
    UsuariosModule,
    ColetaModule,                  // Módulo registrado
    DescarteModule                 // Módulo registrado
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}