import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjetosModule } from './objetos/objetos.module';
import { ColetorModule } from './coletor/coletor.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DescarteModule } from './Descarte/descarte.module';

@Module({
  imports: [ObjetosModule, ColetorModule, UsuariosModule, DescarteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}