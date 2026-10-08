import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { DescarteService } from './descarte.service';
import { CreateDescarteDto } from './dto/create-descarte.dto';
import { UpdateDescarteDto } from './dto/update-descarte.dto';

@Controller('descarte')
export class DescarteController {
  constructor(private readonly descarteService: DescarteService) {}

  @Post()
  create(@Body() dto: CreateDescarteDto) {
    return this.descarteService.create(dto);
  }

  @Get()
  findAll() {
    return this.descarteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.descarteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDescarteDto) {
    return this.descarteService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.descarteService.remove(+id);
  }
}