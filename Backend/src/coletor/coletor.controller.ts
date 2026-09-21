import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ColetorService } from './coletor.service';
import { CreateColetorDto } from './dto/create-coletor.dto';

@Controller('api/coletor')
export class ColetorController {
  constructor(private readonly coletorService: ColetorService) {}

  @Post()
  create(@Body() createColetorDto: CreateColetorDto) {
    return this.coletorService.create(createColetorDto);
  }

  @Post(':id/atualizar')
  atualizarVolume(@Param('id') id: string, @Body('volume') volume: number) {
    return this.coletorService.atualizarVolume(+id, volume);
  }

  @Post(':id/reset')
  resetar(@Param('id') id: string) {
    return this.coletorService.resetar(+id);
  }
}