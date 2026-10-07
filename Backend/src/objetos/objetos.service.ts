import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateObjetoDto } from './dto/create-objeto.dto';
import { UpdateObjetoDto } from './dto/update-objeto.dto';
import { Objeto } from './entities/objeto.entity';

@Injectable()
export class ObjetosService {
  constructor(
    @InjectRepository(Objeto)
    private readonly objetoRepository: Repository<Objeto>,
  ) {}

  create(createObjetoDto: CreateObjetoDto) {
    const objeto = this.objetoRepository.create(createObjetoDto);

    return this.objetoRepository.save(objeto);
  }

  findAll() {
    return this.objetoRepository.find();
  }

  async findOne(id: number) {
    const objeto = await this.objetoRepository.findOneBy({ id });

    if (!objeto) {
      throw new NotFoundException('Objeto não encontrado');
    }

    return objeto;
  }

  async update(id: number, updateObjetoDto: UpdateObjetoDto) {
    const objeto = await this.findOne(id);

    Object.assign(objeto, updateObjetoDto);

    return this.objetoRepository.save(objeto);
  }

  async remove(id: number) {
    const objeto = await this.findOne(id);

    await this.objetoRepository.remove(objeto);
  }
}