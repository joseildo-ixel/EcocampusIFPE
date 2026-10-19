import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { createPageResponse } from '../common/dto/page-query.dto';
import { Descarte } from '../Descarte/entities/descarte.entity';
import { ColetorResponseDto } from './dto/coletor-response.dto';
import { CreateColetorDto } from './dto/create-coletor.dto';
import { ListColetoresQueryDto } from './dto/list-coletores-query.dto';
import { UpdateColetorDto } from './dto/update-coletor.dto';
import { Coletor } from './entities/coletor.entity';

@Injectable()
export class ColetorService {
  constructor(
    @InjectRepository(Coletor)
    private readonly coletores: Repository<Coletor>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateColetorDto): Promise<ColetorResponseDto> {
    const coletor = await this.coletores.save(
      this.coletores.create({ ...dto, volumeAtual: 0 }),
    );
    return this.toResponse(coletor);
  }

  async findAll(query: ListColetoresQueryDto) {
    const { page, limit } = query;
    const builder = this.coletores.createQueryBuilder('coletor');
    if (query.localizacao) {
      builder.andWhere('coletor.localizacao ILIKE :localizacao', {
        localizacao: `%${query.localizacao}%`,
      });
    }
    if (query.ativo !== undefined) {
      builder.andWhere('coletor.ativo = :ativo', { ativo: query.ativo });
    }
    const [coletores, total] = await builder
      .orderBy('coletor.dataCriacao', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return createPageResponse(
      coletores.map((coletor) => this.toResponse(coletor)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<ColetorResponseDto> {
    const coletor = await this.coletores.findOneBy({ id });
    if (!coletor) {
      throw new NotFoundException(`Coletor ${id} não encontrado`);
    }
    return this.toResponse(coletor);
  }

  async update(
    id: string,
    dto: UpdateColetorDto,
  ): Promise<ColetorResponseDto> {
    const updated = await this.dataSource.transaction(async (manager) => {
      const coletores = manager.getRepository(Coletor);
      const coletor = await coletores.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!coletor) {
        throw new NotFoundException(`Coletor ${id} não encontrado`);
      }
      const capacidadeMaxima = dto.capacidadeMaxima ?? coletor.capacidadeMaxima;
      if (Number(coletor.volumeAtual) > Number(capacidadeMaxima)) {
        throw new BadRequestException(
          'A capacidade máxima não pode ser menor que o volume atual',
        );
      }
      return coletores.save(coletores.merge(coletor, dto));
    });
    return this.toResponse(updated);
  }

  async atualizarVolume(
    id: string,
    novoDescarte: number,
  ): Promise<ColetorResponseDto> {
    if (!Number.isFinite(novoDescarte) || novoDescarte <= 0) {
      throw new BadRequestException('O volume adicionado deve ser positivo');
    }
    const updated = await this.dataSource.transaction(async (manager) => {
      const coletores = manager.getRepository(Coletor);
      const coletor = await coletores.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!coletor) {
        throw new NotFoundException(`Coletor ${id} não encontrado`);
      }
      const volumeAtual = Number(coletor.volumeAtual);
      const capacidade = Number(coletor.capacidadeMaxima);
      if (volumeAtual + novoDescarte > capacidade) {
        throw new BadRequestException('A capacidade do coletor seria excedida');
      }
      coletor.volumeAtual = Number((volumeAtual + novoDescarte).toFixed(2));
      return coletores.save(coletor);
    });
    return this.toResponse(updated);
  }

  async resetar(id: string): Promise<ColetorResponseDto> {
    const updated = await this.dataSource.transaction(async (manager) => {
      const coletores = manager.getRepository(Coletor);
      const coletor = await coletores.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!coletor) {
        throw new NotFoundException(`Coletor ${id} não encontrado`);
      }
      await manager
        .getRepository(Descarte)
        .createQueryBuilder()
        .update()
        .set({ status: 'finalizado' })
        .where('"coletorId" = :id', { id })
        .andWhere('"status" != :status', { status: 'finalizado' })
        .execute();
      coletor.volumeAtual = 0;
      return coletores.save(coletor);
    });
    return this.toResponse(updated);
  }

  async remove(id: string): Promise<{ id: string; deleted: true }> {
    const result = await this.coletores.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Coletor ${id} não encontrado`);
    }
    return { id, deleted: true };
  }

  private toResponse(coletor: Coletor): ColetorResponseDto {
    return {
      id: coletor.id,
      localizacao: coletor.localizacao,
      capacidadeMaxima: Number(coletor.capacidadeMaxima),
      volumeAtual: Number(coletor.volumeAtual),
      ativo: coletor.ativo,
      dataCriacao: coletor.dataCriacao,
    };
  }
}
