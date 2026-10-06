import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
// Certifique-se de que os caminhos e nomes dos DTOs batem com os seus arquivos
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    // Injeta o repositório do TypeORM para a entidade Usuario
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // 1. CREATE - Salva no banco de dados
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const novoUsuario = this.usuarioRepository.create(createUsuarioDto);
    return await this.usuarioRepository.save(novoUsuario);
  }

  // 2. READ ALL - Busca todos os registros
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  // 3. READ ONE - Busca por ID com tratamento de erro (exigência da rubrica)
  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não foi encontrado.`);
    }
    return usuario;
  }

  // 4. UPDATE - Atualiza um registro existente
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id); // Verifica se existe antes de atualizar
    
    // Mescla os dados novos com os dados existentes
    this.usuarioRepository.merge(usuario, updateUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  // 5. DELETE - Remove do banco de dados
  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id); // Verifica se existe antes de deletar
    await this.usuarioRepository.remove(usuario);
  }
}