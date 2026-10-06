import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coleta } from './entities/coleta.entity';
import { CreateColetaDto } from './dto/create-coleta.dto';
import { UpdateColetaDto } from './dto/update-coleta.dto';

@Injectable()
export class ColetaService {
  constructor(
    @InjectRepository(Coleta)
    private readonly coletaRepository: Repository<Coleta>,
  ) {}

  async create(createColetaDto: CreateColetaDto): Promise<Coleta> {
    const novaColeta = this.coletaRepository.create(createColetaDto);
    return await this.coletaRepository.save(novaColeta);
  }

  async findAll(): Promise<Coleta[]> {
    return await this.coletaRepository.find();
  }

  async findOne(id: string): Promise<Coleta> {
    const coleta = await this.coletaRepository.findOneBy({ id });
    if (!coleta) {
      throw new NotFoundException(`Coleta com ID ${id} não foi encontrada.`);
    }
    return coleta;
  }

  async update(id: string, updateColetaDto: UpdateColetaDto): Promise<Coleta> {
    const coleta = await this.findOne(id);
    this.coletaRepository.merge(coleta, updateColetaDto);
    return await this.coletaRepository.save(coleta);
  }

  async remove(id: string): Promise<void> {
    const coleta = await this.findOne(id);
    await this.coletaRepository.remove(coleta);
  }
}