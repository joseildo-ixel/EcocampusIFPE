import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DescarteController } from './descarte.controller';
import { DescarteService } from './descarte.service';
import { Descarte } from './entities/descarte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Descarte])],
  controllers: [DescarteController],
  providers: [DescarteService],
})
export class DescarteModule {}