import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ColetorService } from './coletor.service';
import { CreateColetorDto } from './dto/create-coletor.dto';
import { UpdateColetorDto } from './dto/update-coletor.dto';
import { ListColetoresQueryDto } from './dto/list-coletores-query.dto';
import { AddColetorVolumeDto } from './dto/add-coletor-volume.dto';

@Controller('api/coletor')
export class ColetorController {
  constructor(private readonly coletorService: ColetorService) {}

  @Post()
  create(@Body() createColetorDto: CreateColetorDto) {
    return this.coletorService.create(createColetorDto);
  }

  @Get()
  findAll(@Query() query: ListColetoresQueryDto) {
    return this.coletorService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coletorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateColetorDto,
  ) {
    return this.coletorService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coletorService.remove(id);
  }

  @Post(':id/atualizar')
  atualizarVolume(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddColetorVolumeDto,
  ) {
    return this.coletorService.atualizarVolume(id, dto.volume);
  }

  @Post(':id/reset')
  resetar(@Param('id', ParseUUIDPipe) id: string) {
    return this.coletorService.resetar(id);
  }
}