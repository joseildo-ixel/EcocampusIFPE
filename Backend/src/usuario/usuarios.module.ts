import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller'; // Ajuste o nome do arquivo se estiver no singular
import { UsuariosService } from './usuarios.service';       // Ajuste o nome do arquivo se estiver no singular
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}