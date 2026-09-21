import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjetosService } from './objetos.service';
import { CreateObjetoDto } from './dto/create-objeto.dto';
import { UpdateObjetoDto } from './dto/update-objeto.dto';

@Controller('objetos')
export class ObjetosController {
  constructor(private readonly objetosService: ObjetosService) {}

 @Post()
  create(@Body() createObjetoDto: CreateObjetoDto) {
    return this.objetosService.create(createObjetoDto);
  }

  @Get()
  findAll() {
    return this.objetosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objetosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateObjetoDto: UpdateObjetoDto) {
    return this.objetosService.update(+id, updateObjetoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.objetosService.remove(+id);
  }
}
