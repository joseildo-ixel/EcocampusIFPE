import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Objeto } from './entities/objeto.entity';
import { CreateObjetoDto } from './dto/create-objeto.dto';
import { UpdateObjetoDto } from './dto/update-objeto.dto';

@Injectable()
export class ObjetosService {
  constructor(
    @InjectRepository(Objeto)
    private readonly objetoRepository: Repository<Objeto>,
  ) {}

  async create(createObjetoDto: CreateObjetoDto): Promise<Objeto> {
    const novoObjeto = this.objetoRepository.create(createObjetoDto);
    return await this.objetoRepository.save(novoObjeto);
  }

  async findAll(): Promise<Objeto[]> {
    return await this.objetoRepository.find();
  }

  async findOne(id: number): Promise<Objeto> {
    const objeto = await this.objetoRepository.findOneBy({ id: Number(id) });
    if (!objeto) {
      throw new NotFoundException(`Objeto com ID ${id} não foi encontrado.`);
    }
    return objeto;
  }

  async update(id: number, updateObjetoDto: UpdateObjetoDto): Promise<Objeto> {
    const objeto = await this.findOne(id);
    this.objetoRepository.merge(objeto, updateObjetoDto);
    return await this.objetoRepository.save(objeto);
  }

  async remove(id: number): Promise<void> {
    const objeto = await this.findOne(id);
    await this.objetoRepository.remove(objeto);
  }
}