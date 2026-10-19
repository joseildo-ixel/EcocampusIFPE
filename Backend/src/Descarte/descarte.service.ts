import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { createPageResponse } from '../common/dto/page-query.dto';
import { isUniqueConstraintViolation } from '../common/database-errors';
import { Coletor } from '../coletor/entities/coletor.entity';
import { Objeto } from '../objetos/entities/objeto.entity';
import { DescarteItem } from '../objetos/entities/descarte-item.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateDescarteDto } from './dto/create-descarte.dto';
import { DescarteResponseDto } from './dto/descarte-response.dto';
import { ListDescartesQueryDto } from './dto/list-descartes-query.dto';
import { UpdateDescarteDto } from './dto/update-descarte.dto';
import { Descarte } from './entities/descarte.entity';

@Injectable()
export class DescarteService {
  constructor(
    @InjectRepository(Descarte)
    private readonly descartes: Repository<Descarte>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateDescarteDto): Promise<DescarteResponseDto> {
    let descarteId: string;
    try {
      descarteId = await this.dataSource.transaction(async (manager) => {
        const usuarios = manager.getRepository(Usuario);
        const coletores = manager.getRepository(Coletor);
        const objetos = manager.getRepository(Objeto);
        const descartes = manager.getRepository(Descarte);
        const itens = manager.getRepository(DescarteItem);

        const usuario = await usuarios.findOneBy({ id: dto.usuarioId });
        if (!usuario) {
          throw new NotFoundException(
            `Usuário ${dto.usuarioId} não encontrado`,
          );
        }

        const coletor = await coletores.findOne({
          where: { id: dto.coletorId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!coletor) {
          throw new NotFoundException(
            `Coletor ${dto.coletorId} não encontrado`,
          );
        }
        if (!coletor.ativo) {
          throw new BadRequestException('O coletor está inativo');
        }

        const volumeAtual = Number(coletor.volumeAtual);
        const capacidade = Number(coletor.capacidadeMaxima);
        if (volumeAtual + dto.pesoKg > capacidade) {
          throw new BadRequestException(
            'O descarte excede a capacidade disponível do coletor',
          );
        }

        const itemObjectIds = (dto.itens ?? []).map((item) => item.objetoId);
        if (new Set(itemObjectIds).size !== itemObjectIds.length) {
          throw new BadRequestException(
            'Cada objeto pode aparecer apenas uma vez na lista de itens',
          );
        }
        const objectsById = new Map<string, Objeto>();
        for (const objetoId of itemObjectIds) {
          const objeto = await objetos.findOneBy({ id: objetoId });
          if (!objeto) {
            throw new NotFoundException(`Objeto ${objetoId} não encontrado`);
          }
          if (!objeto.ativo) {
            throw new BadRequestException(`Objeto ${objetoId} está inativo`);
          }
          objectsById.set(objetoId, objeto);
        }

        const descarte = await descartes.save(
          descartes.create({
            status: dto.status ?? 'pendente',
            dataDescarte: dto.dataDescarte
              ? new Date(dto.dataDescarte)
              : new Date(),
            pesoKg: dto.pesoKg,
            tipoResiduo: dto.tipoResiduo,
            destino: dto.destino,
            observacoes: dto.observacoes ?? null,
            usuarioId: dto.usuarioId,
            coletorId: dto.coletorId,
          }),
        );

        if (dto.itens?.length) {
          await itens.save(
            dto.itens.map((item) =>
              itens.create({
                descarteId: descarte.id,
                objetoId: item.objetoId,
                quantidade: item.quantidade,
                objeto: objectsById.get(item.objetoId),
              }),
            ),
          );
        }

        coletor.volumeAtual = Number((volumeAtual + dto.pesoKg).toFixed(2));
        await coletores.save(coletor);
        return descarte.id;
      });
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException(
          'O descarte contém objetos repetidos',
        );
      }
      throw error;
    }
    return this.findOne(descarteId);
  }

  async findAll(query: ListDescartesQueryDto) {
    const { page, limit } = query;
    const builder = this.descartes
      .createQueryBuilder('descarte')
      .leftJoinAndSelect('descarte.itens', 'item')
      .leftJoinAndSelect('item.objeto', 'objeto');
    if (query.status) {
      builder.andWhere('descarte.status = :status', { status: query.status });
    }
    if (query.tipoResiduo) {
      builder.andWhere('descarte.tipoResiduo = :tipoResiduo', {
        tipoResiduo: query.tipoResiduo,
      });
    }
    if (query.usuarioId) {
      builder.andWhere('descarte.usuarioId = :usuarioId', {
        usuarioId: query.usuarioId,
      });
    }
    if (query.coletorId) {
      builder.andWhere('descarte.coletorId = :coletorId', {
        coletorId: query.coletorId,
      });
    }
    const [descartes, total] = await builder
      .orderBy('descarte.dataCriacao', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return createPageResponse(
      descartes.map((descarte) => this.toResponse(descarte)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<DescarteResponseDto> {
    const descarte = await this.descartes.findOne({
      where: { id },
      relations: { itens: { objeto: true } },
    });
    if (!descarte) {
      throw new NotFoundException(`Descarte ${id} não encontrado`);
    }
    return this.toResponse(descarte);
  }

  async update(
    id: string,
    dto: UpdateDescarteDto,
  ): Promise<DescarteResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const descartes = manager.getRepository(Descarte);
      const descarte = await descartes.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!descarte) {
        throw new NotFoundException(`Descarte ${id} não encontrado`);
      }

      const newWeight = dto.pesoKg ?? Number(descarte.pesoKg);
      const newStatus = dto.status ?? descarte.status;
      const currentContribution =
        descarte.status === 'finalizado' ? 0 : Number(descarte.pesoKg);
      const updatedContribution =
        newStatus === 'finalizado' ? 0 : Number(newWeight);
      const weightDelta = updatedContribution - currentContribution;
      if (weightDelta !== 0 && descarte.coletorId) {
        const coletores = manager.getRepository(Coletor);
        const coletor = await coletores.findOne({
          where: { id: descarte.coletorId },
          lock: { mode: 'pessimistic_write' },
        });
        if (coletor) {
          const volumeAtual = Number(coletor.volumeAtual);
          const novoVolume = volumeAtual + weightDelta;
          if (novoVolume < 0) {
            throw new ConflictException(
              'O volume do coletor não corresponde ao peso deste descarte',
            );
          }
          if (novoVolume > Number(coletor.capacidadeMaxima)) {
            throw new BadRequestException(
              'A atualização excede a capacidade disponível do coletor',
            );
          }
          coletor.volumeAtual = Number(novoVolume.toFixed(2));
          await coletores.save(coletor);
        }
      }
      await descartes.save(descartes.merge(descarte, dto));
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ id: string; deleted: true }> {
    await this.dataSource.transaction(async (manager) => {
      const descartes = manager.getRepository(Descarte);
      const descarte = await descartes.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!descarte) {
        throw new NotFoundException(`Descarte ${id} não encontrado`);
      }
      if (descarte.coletorId && descarte.status !== 'finalizado') {
        const coletores = manager.getRepository(Coletor);
        const coletor = await coletores.findOne({
          where: { id: descarte.coletorId },
          lock: { mode: 'pessimistic_write' },
        });
        if (coletor) {
          coletor.volumeAtual = Number(
            Math.max(
              0,
              Number(coletor.volumeAtual) - Number(descarte.pesoKg),
            ).toFixed(2),
          );
          await coletores.save(coletor);
        }
      }
      await descartes.remove(descarte);
    });
    return { id, deleted: true };
  }

  private toResponse(descarte: Descarte): DescarteResponseDto {
    return {
      id: descarte.id,
      status: descarte.status,
      dataDescarte: descarte.dataDescarte,
      pesoKg: Number(descarte.pesoKg),
      tipoResiduo: descarte.tipoResiduo,
      destino: descarte.destino,
      observacoes: descarte.observacoes ?? null,
      dataCriacao: descarte.dataCriacao,
      usuarioId: descarte.usuarioId,
      coletorId: descarte.coletorId ?? null,
      itens: (descarte.itens ?? []).map((item) => ({
        id: item.id,
        objetoId: item.objetoId,
        quantidade: item.quantidade,
        objeto: {
          nome: item.objeto.nome,
          tipo: item.objeto.tipo,
          pesoKg: Number(item.objeto.pesoKg),
        },
      })),
    };
  }
}
