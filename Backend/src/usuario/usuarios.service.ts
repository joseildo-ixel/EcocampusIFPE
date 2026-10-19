import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt } from 'node:crypto';
import { Repository } from 'typeorm';
import { createPageResponse } from '../common/dto/page-query.dto';
import {
  isForeignKeyViolation,
  isUniqueConstraintViolation,
} from '../common/database-errors';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ListUsuariosQueryDto } from './dto/list-usuarios-query.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioResponseDto } from './dto/usuario-response.dto';
import { Usuario } from './entities/usuario.entity';

function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarios: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
    const senha = await hashPassword(dto.senha);
    try {
      const usuario = await this.usuarios.save(
        this.usuarios.create({ ...dto, senha }),
      );
      return this.toResponse(usuario);
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw error;
    }
  }

  async findAll(query: ListUsuariosQueryDto) {
    const { page, limit } = query;
    const builder = this.usuarios.createQueryBuilder('usuario');

    if (query.nome) {
      builder.andWhere('usuario.nome ILIKE :nome', {
        nome: `%${query.nome}%`,
      });
    }
    if (query.email) {
      builder.andWhere('usuario.email ILIKE :email', {
        email: `%${query.email}%`,
      });
    }
    if (query.role) {
      builder.andWhere('usuario.role = :role', { role: query.role });
    }
    if (query.ativo !== undefined) {
      builder.andWhere('usuario.ativo = :ativo', { ativo: query.ativo });
    }

    const [usuarios, total] = await builder
      .orderBy('usuario.dataCriacao', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return createPageResponse(
      usuarios.map((usuario) => this.toResponse(usuario)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarios.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }
    return this.toResponse(usuario);
  }

  async update(
    id: string,
    dto: UpdateUsuarioDto,
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarios.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }

    const updates = { ...dto };
    if (updates.senha) {
      updates.senha = await hashPassword(updates.senha);
    }

    try {
      await this.usuarios.save(this.usuarios.merge(usuario, updates));
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw error;
    }
    return this.toResponse(await this.usuarios.findOneByOrFail({ id }));
  }

  async remove(id: string): Promise<{ id: string; deleted: true }> {
    try {
      const result = await this.usuarios.delete(id);
      if (!result.affected) {
        throw new NotFoundException(`Usuário ${id} não encontrado`);
      }
      return { id, deleted: true };
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ConflictException(
          'Não é possível remover um usuário com descartes associados',
        );
      }
      throw error;
    }
  }

  private toResponse(usuario: Usuario): UsuarioResponseDto {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      ativo: usuario.ativo,
      dataCriacao: usuario.dataCriacao,
    };
  }
}
