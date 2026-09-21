import { Module } from '@nestjs/common';
import { ColetorService } from './coletor.service';
import { ColetorController } from './coletor.controller';

@Module({
  controllers: [ColetorController],
  providers: [ColetorService],
})
export class ColetorModule {}
