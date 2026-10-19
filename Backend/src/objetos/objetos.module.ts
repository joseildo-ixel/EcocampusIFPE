import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjetosService } from './objetos.service';
import { ObjetosController } from './objetos.controller';
import { Objeto } from './entities/objeto.entity';
import { DescarteItem } from './entities/descarte-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Objeto, DescarteItem])],
  controllers: [ObjetosController],
  providers: [ObjetosService],
})
export class ObjetosModule {}
