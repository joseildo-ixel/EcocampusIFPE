import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coletor } from './entities/coletor.entity';
import { CreateColetorDto } from './dto/create-coletor.dto';
import { UpdateColetorDto } from './dto/update-coletor.dto';

@Injectable()
export class ColetorService {
  constructor(
    @InjectRepository(Coletor)
    private readonly coletorRepository: Repository<Coletor>,
  ) {}

  async create(createColetorDto: CreateColetorDto): Promise<Coletor> {
    const novoColetor = this.coletorRepository.create(createColetorDto);
    return await this.coletorRepository.save(novoColetor);
  }

  async findAll(): Promise<Coletor[]> {
    return await this.coletorRepository.find();
  }

  async findOne(id: string): Promise<Coletor> {
    const coletor = await this.coletorRepository.findOneBy({ id });
    if (!coletor) {
      throw new NotFoundException(`Coletor com ID ${id} não foi encontrado.`);
    }
    return coletor;
  }

  async update(id: string, updateColetorDto: UpdateColetorDto): Promise<Coletor> {
    const coletor = await this.findOne(id);
    this.coletorRepository.merge(coletor, updateColetorDto);
    return await this.coletorRepository.save(coletor);
  }

  async remove(id: string): Promise<void> {
    const coletor = await this.findOne(id);
    await this.coletorRepository.remove(coletor);
  }
}