import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjetosModule } from './objetos/objetos.module';

@Module({
  imports: [ObjetosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}