import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DescarteController } from './descarte.controller';
import { DescarteService } from './descarte.service';
import { Descarte } from './entities/descarte.entity';
import { DescarteItem } from '../objetos/entities/descarte-item.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Coletor } from '../coletor/entities/coletor.entity';
import { Objeto } from '../objetos/entities/objeto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Descarte, DescarteItem, Usuario, Coletor, Objeto]),
  ],
  controllers: [DescarteController],
  providers: [DescarteService],
})
export class DescarteModule {}