import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjetosModule } from './objetos/objetos.module';
import { ColetorModule } from './coletor/coletor.module';

@Module({
  imports: [ObjetosModule, ColetorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}