import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  create(createUsuarioDto: CreateUsuarioDto) {
    return 'Esta ação adiciona um novo utilizador';
  }

  findAll() {
    return 'Esta ação devolve todos os utilizadores';
  }
}