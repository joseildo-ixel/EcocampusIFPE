import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColetaDto } from './dto/create-coleta.dto';
import { UpdateColetaDto } from './dto/update-coleta.dto';
import { Coleta } from './entities/coleta.entity';

@Injectable()
export class ColetaService {
  constructor(
    @InjectRepository(Coleta)
    private readonly coletaRepository: Repository<Coleta>,
  ) {}

  create(createColetaDto: CreateColetaDto) {
    const coleta = this.coletaRepository.create(createColetaDto);

    return this.coletaRepository.save(coleta);
  }

  findAll() {
    return this.coletaRepository.find();
  }

  async findOne(id: number) {
    const coleta = await this.coletaRepository.findOneBy({ id });

    if (!coleta) {
      throw new NotFoundException('Coleta não encontrada');
    }

    return coleta;
  }

  async update(id: number, updateColetaDto: UpdateColetaDto) {
    const coleta = await this.findOne(id);

    Object.assign(coleta, updateColetaDto);

    return this.coletaRepository.save(coleta);
  }

  async remove(id: number) {
    const coleta = await this.findOne(id);

    await this.coletaRepository.remove(coleta);
  }
}