import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const novoUsuario = this.usuarioRepository.create(createUsuarioDto);
    return await this.usuarioRepository.save(novoUsuario);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException(
        `Usuário com ID ${id} não foi encontrado.`,
      );
    }

    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.findOne(id);

    this.usuarioRepository.merge(usuario, updateUsuarioDto);

    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);

    await this.usuarioRepository.remove(usuario);
  }
}