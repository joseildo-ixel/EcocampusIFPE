import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjetosModule } from './objetos/objetos.module';
import { ColetorModule } from './coletor/coletor.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [ObjetosModule, ColetorModule, UsuariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}