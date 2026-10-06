import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjetosController } from './objetos.controller';
import { ObjetosService } from './objetos.service';
import { Objeto } from './entities/objeto.entity'; // Certifique-se de que o nome do arquivo da entidade é este

@Module({
  imports: [TypeOrmModule.forFeature([Objeto])],
  controllers: [ObjetosController],
  providers: [ObjetosService],
})
export class ObjetosModule {}