import { Module } from '@nestjs/common';
import { ColetaService } from './coleta.service';
import { ColetaController } from './coleta.controller';

@Module({
  controllers: [ColetaController],
  providers: [ColetaService],
})
export class ColetaModule {}
