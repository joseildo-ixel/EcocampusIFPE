import { Injectable } from '@nestjs/common';

@Injectable()
export class DescarteService {
  constructor() {}

  create(dto: any) {
    return 'Esta ação simula a criação de um novo descarte.';
  }

  findAll() {
    return 'Esta ação simula a devolução de todos os descartes.';
  }

  findOne(id: number) {
    return `Esta ação simula a procura do descarte #${id}.`;
  }

  update(id: number, dto: any) {
    return `Esta ação simula a atualização do descarte #${id}.`;
  }

  remove(id: number) {
    return `Esta ação simula a remoção do descarte #${id}.`;
  }
}