import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColetorController } from './coletor.controller';
import { ColetorService } from './coletor.service';
import { Coletor } from './entities/coletor.entity'; // Importe a entidade

@Module({
  // Registra a entidade para poder usá-la no banco
  imports: [TypeOrmModule.forFeature([Coletor])], 
  controllers: [ColetorController],
  providers: [ColetorService],
})
export class ColetorModule {}