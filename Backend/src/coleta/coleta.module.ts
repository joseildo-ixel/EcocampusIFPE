import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColetaController } from './coleta.controller';
import { ColetaService } from './coleta.service';
import { Coleta } from './entities/coleta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coleta])],
  controllers: [ColetaController],
  providers: [ColetaService],
})
export class ColetaModule {}