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
import { ObjetosService } from './objetos.service';
import { CreateObjetoDto } from './dto/create-objeto.dto';
import { UpdateObjetoDto } from './dto/update-objeto.dto';
import { ListObjetosQueryDto } from './dto/list-objetos-query.dto';

@Controller('objetos')
export class ObjetosController {
  constructor(private readonly objetosService: ObjetosService) {}

  @Post()
  create(@Body() createObjetoDto: CreateObjetoDto) {
    return this.objetosService.create(createObjetoDto);
  }

  @Get()
  findAll(@Query() query: ListObjetosQueryDto) {
    return this.objetosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.objetosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateObjetoDto: UpdateObjetoDto,
  ) {
    return this.objetosService.update(id, updateObjetoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.objetosService.remove(id);
  }
}
