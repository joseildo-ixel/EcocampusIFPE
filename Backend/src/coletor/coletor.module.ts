import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColetorService } from './coletor.service';
import { ColetorController } from './coletor.controller';
import { Coletor } from './entities/coletor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coletor])],
  controllers: [ColetorController],
  providers: [ColetorService],
})
export class ColetorModule {}
