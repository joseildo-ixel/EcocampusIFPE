import { Module } from '@nestjs/common';
import { ObjetosService } from './objetos.service';
import { ObjetosController } from './objetos.controller';

@Module({
  controllers: [ObjetosController],
  providers: [ObjetosService],
})
export class ObjetosModule {}
