import { Injectable } from '@nestjs/common';
import { CreateObjetoDto } from './dto/create-objeto.dto';
import { UpdateObjetoDto } from './dto/update-objeto.dto';

@Injectable()
export class ObjetosService {
  create(createObjetoDto: CreateObjetoDto) {
    return 'This action adds a new objeto';
  }

  findAll() {
    return `This action returns all objetos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} objeto`;
  }

  update(id: number, updateObjetoDto: UpdateObjetoDto) {
    return `This action updates a #${id} objeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} objeto`;
  }
}
