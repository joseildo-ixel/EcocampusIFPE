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
import { DescarteService } from './descarte.service';
import { CreateDescarteDto } from './dto/create-descarte.dto';
import { UpdateDescarteDto } from './dto/update-descarte.dto';
import { ListDescartesQueryDto } from './dto/list-descartes-query.dto';

@Controller('descarte')
export class DescarteController {
  constructor(private readonly descarteService: DescarteService) {}

  @Post()
  create(@Body() dto: CreateDescarteDto) {
    return this.descarteService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListDescartesQueryDto) {
    return this.descarteService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.descarteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDescarteDto,
  ) {
    return this.descarteService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.descarteService.remove(id);
  }
}