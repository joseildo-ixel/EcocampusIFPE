import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Descarte } from './entities/descarte.entity';
import { CreateDescarteDto } from './dto/create-descarte.dto';
import { UpdateDescarteDto } from './dto/update-descarte.dto';

@Injectable()
export class DescarteService {
  constructor(
    @InjectRepository(Descarte)
    private descarteRepository: Repository<Descarte>,
  ) {}

  create(dto: CreateDescarteDto) {
    const descarte = this.descarteRepository.create(dto);
    return this.descarteRepository.save(descarte);
  }

  findAll() {
    return this.descarteRepository.find();
  }

  findOne(id: number) {
    return this.descarteRepository.findOneBy({ id });
  }

  update(id: number, dto: UpdateDescarteDto) {
    return this.descarteRepository.update(id, dto);
  }

  remove(id: number) {
    return this.descarteRepository.delete(id);
  }
}