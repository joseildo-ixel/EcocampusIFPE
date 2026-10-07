import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColetorDto } from './dto/create-coletor.dto';
import { Coletor } from './entities/coletor.entity';

@Injectable()
export class ColetorService {
  constructor(
    @InjectRepository(Coletor)
    private readonly coletorRepository: Repository<Coletor>,
  ) {}

  create(createColetorDto: CreateColetorDto) {
    const coletor = this.coletorRepository.create(createColetorDto);

    return this.coletorRepository.save(coletor);
  }

  async atualizarVolume(id: number, novoDescarte: number) {
    const coletor = await this.findOne(id);

    coletor.volumeAtual += novoDescarte;

    return this.coletorRepository.save(coletor);
  }

  async resetar(id: number) {
    const coletor = await this.findOne(id);

    coletor.volumeAtual = 0;

    return this.coletorRepository.save(coletor);
  }

  private async findOne(id: number) {
    const coletor = await this.coletorRepository.findOneBy({ id });

    if (!coletor) {
      throw new NotFoundException('Coletor não encontrado');
    }

    return coletor;
  }
}