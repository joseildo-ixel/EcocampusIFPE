import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColetaService } from './coleta.service';
import { ColetaController } from './coleta.controller';
import { Coleta } from './entities/coleta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coleta])],
  controllers: [ColetaController],
  providers: [ColetaService],
})
export class ColetaModule {}