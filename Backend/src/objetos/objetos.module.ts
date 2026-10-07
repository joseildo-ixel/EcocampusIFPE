import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjetosService } from './objetos.service';
import { ObjetosController } from './objetos.controller';
import { Objeto } from './entities/objeto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Objeto])],
  controllers: [ObjetosController],
  providers: [ObjetosService],
})
export class ObjetosModule {}