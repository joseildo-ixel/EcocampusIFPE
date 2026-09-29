import { Injectable } from '@nestjs/common';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  private usuarios: Usuario[] = [];

  create(createUsuarioDto: CreateUsuarioDto): Usuario {
    const novoUsuario: Usuario = {
      id: Math.random().toString(36).substring(2, 9),
      ...createUsuarioDto,
      senhaHash: createUsuarioDto.senha, // Em produção, aplicar hash de senha aqui (ex: bcrypt)
      ativo: true,
      criadoEm: new Date(),
    };

    this.usuarios.push(novoUsuario);
    return novoUsuario;
  }

  findAll(): Usuario[] {
    return this.usuarios;
  }
}