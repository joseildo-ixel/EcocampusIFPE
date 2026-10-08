import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Descarte } from './entities/descarte.entity';
import { CreateDescarteDto } from './dto/create-descarte.dto';
import { UpdateDescarteDto } from './dto/update-descarte.dto';

@Injectable()
export class DescarteService {
  constructor(
    @InjectRepository(Descarte)
    private readonly descarteRepository: Repository<Descarte>,
  ) {}

  async create(createDescarteDto: CreateDescarteDto): Promise<Descarte> {
    const novoDescarte = this.descarteRepository.create(createDescarteDto);
    return await this.descarteRepository.save(novoDescarte);
  }

  async findAll(): Promise<Descarte[]> {
    return await this.descarteRepository.find();
  }

  async findOne(id: string): Promise<Descarte> {
    const descarte = await this.descarteRepository.findOneBy({ id });
    if (!descarte) {
      throw new NotFoundException(`Descarte com ID ${id} não foi encontrado.`);
    }
    return descarte;
  }

  async update(id: string, updateDescarteDto: UpdateDescarteDto): Promise<Descarte> {
    const descarte = await this.findOne(id);
    this.descarteRepository.merge(descarte, updateDescarteDto);
    return await this.descarteRepository.save(descarte);
  }

  async remove(id: string): Promise<void> {
    const descarte = await this.findOne(id);
    await this.descarteRepository.remove(descarte);
  }
}