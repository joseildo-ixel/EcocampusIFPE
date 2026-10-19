import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isForeignKeyViolation } from '../common/database-errors';
import { createPageResponse } from '../common/dto/page-query.dto';
import { CreateObjetoDto } from './dto/create-objeto.dto';
import { ListObjetosQueryDto } from './dto/list-objetos-query.dto';
import { ObjetoResponseDto } from './dto/objeto-response.dto';
import { UpdateObjetoDto } from './dto/update-objeto.dto';
import { Objeto } from './entities/objeto.entity';

@Injectable()
export class ObjetosService {
  constructor(
    @InjectRepository(Objeto)
    private readonly objetos: Repository<Objeto>,
  ) {}

  async create(dto: CreateObjetoDto): Promise<ObjetoResponseDto> {
    const objeto = await this.objetos.save(this.objetos.create(dto));
    return this.toResponse(objeto);
  }

  async findAll(query: ListObjetosQueryDto) {
    const { page, limit } = query;
    const builder = this.objetos.createQueryBuilder('objeto');
    if (query.nome) {
      builder.andWhere('objeto.nome ILIKE :nome', {
        nome: `%${query.nome}%`,
      });
    }
    if (query.tipo) {
      builder.andWhere('objeto.tipo = :tipo', { tipo: query.tipo });
    }
    if (query.ativo !== undefined) {
      builder.andWhere('objeto.ativo = :ativo', { ativo: query.ativo });
    }
    const [objetos, total] = await builder
      .orderBy('objeto.dataCriacao', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return createPageResponse(
      objetos.map((objeto) => this.toResponse(objeto)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<ObjetoResponseDto> {
    const objeto = await this.objetos.findOneBy({ id });
    if (!objeto) {
      throw new NotFoundException(`Objeto ${id} não encontrado`);
    }
    return this.toResponse(objeto);
  }

  async update(
    id: string,
    dto: UpdateObjetoDto,
  ): Promise<ObjetoResponseDto> {
    const objeto = await this.objetos.findOneBy({ id });
    if (!objeto) {
      throw new NotFoundException(`Objeto ${id} não encontrado`);
    }
    const updated = await this.objetos.save(this.objetos.merge(objeto, dto));
    return this.toResponse(updated);
  }

  async remove(id: string): Promise<{ id: string; deleted: true }> {
    try {
      const result = await this.objetos.delete(id);
      if (!result.affected) {
        throw new NotFoundException(`Objeto ${id} não encontrado`);
      }
      return { id, deleted: true };
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ConflictException(
          'Não é possível remover um objeto associado a um descarte',
        );
      }
      throw error;
    }
  }

  private toResponse(objeto: Objeto): ObjetoResponseDto {
    return {
      id: objeto.id,
      nome: objeto.nome,
      descricao: objeto.descricao,
      tipo: objeto.tipo,
      pesoKg: Number(objeto.pesoKg),
      ativo: objeto.ativo,
      dataCriacao: objeto.dataCriacao,
    };
  }
}
