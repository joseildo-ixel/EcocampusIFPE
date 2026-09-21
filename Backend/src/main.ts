import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa a validação automática para todos os DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      forbidNonWhitelisted: true, // Retorna erro se enviarem campos extras não permitidos
      transform: true, // Transforma os tipos automaticamente (ex: string para number)
    }),
  );

  await app.listen(3000);
}
bootstrap();