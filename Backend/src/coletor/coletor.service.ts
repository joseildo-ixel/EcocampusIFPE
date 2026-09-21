import { Injectable } from '@nestjs/common';
import { CreateColetorDto } from './dto/create-coletor.dto';

@Injectable()
export class ColetorService {
  create(createColetorDto: CreateColetorDto) {
    return 'Essa ação adiciona um novo coletor no banco de dados';
  }

  atualizarVolume(id: number, novoDescarte: number) {
    return `Essa ação vai somar o descarte ao volumeAtual do coletor #${id} e checar o alerta de 80%`;
  }

  resetar(id: number) {
    return `Essa ação zera o volume do coletor #${id} após a equipe fazer a coleta física`;
  }
}