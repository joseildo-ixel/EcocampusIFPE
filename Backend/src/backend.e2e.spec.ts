import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from './app.module';
import { Coletor } from './coletor/entities/coletor.entity';
import { Descarte } from './Descarte/entities/descarte.entity';
import { Objeto } from './objetos/entities/objeto.entity';
import { Usuario } from './usuario/entities/usuario.entity';

describe('EcoCampus API (PostgreSQL)', () => {
  let app: Awaited<ReturnType<typeof NestFactory.create>>;
  let baseUrl: string;
  const ids: {
    usuario?: string;
    coletor?: string;
    objeto?: string;
    descarte?: string;
    archiveCollector?: string;
    archiveDisposal?: string;
  } = {};

  async function request<T>(
    path: string,
    method = 'GET',
    body?: unknown,
  ): Promise<{ status: number; body: T }> {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    return {
      status: response.status,
      body: (await response.json()) as T,
    };
  }

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.listen(0, '127.0.0.1');
    const address = app.getHttpServer().address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  }, 30000);

  afterAll(async () => {
    if (app) {
      const dataSource = app.get(DataSource);
      if (ids.descarte) {
        await dataSource.getRepository(Descarte).delete(ids.descarte);
      }
      if (ids.archiveDisposal) {
        await dataSource.getRepository(Descarte).delete(ids.archiveDisposal);
      }
      if (ids.usuario) {
        await dataSource.getRepository(Usuario).delete(ids.usuario);
      }
      if (ids.coletor) {
        await dataSource.getRepository(Coletor).delete(ids.coletor);
      }
      if (ids.archiveCollector) {
        await dataSource.getRepository(Coletor).delete(ids.archiveCollector);
      }
      if (ids.objeto) {
        await dataSource.getRepository(Objeto).delete(ids.objeto);
      }
      await app.close();
    }
  });

  it('persists CRUD, relations, filters, validation, and collector capacity', async () => {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const invalidUser = await request('/usuarios', 'POST', {
      nome: '',
      email: 'invalido',
      senha: '123',
      role: 'desconhecido',
    });
    expect(invalidUser.status).toBe(400);

    const createdUser = await request<{ id: string; senha?: string }>(
      '/usuarios',
      'POST',
      {
        nome: 'Teste integração',
        email: `integracao-${suffix}@example.test`,
        senha: 'SenhaSegura123',
        role: 'usuario',
      },
    );
    expect(createdUser.status).toBe(201);
    expect(createdUser.body.id).toBeTruthy();
    expect(createdUser.body).not.toHaveProperty('senha');
    ids.usuario = createdUser.body.id;
    const storedPassword = await app
      .get(DataSource)
      .query('SELECT "senha" FROM "usuarios" WHERE "id" = $1', [ids.usuario]);
    expect(storedPassword[0].senha).not.toBe('SenhaSegura123');

    const userList = await request<{
      data: Array<{ id: string }>;
      meta: { total: number; page: number };
    }>(
      `/usuarios?email=${encodeURIComponent(
        `integracao-${suffix}@example.test`,
      )}&page=1&limit=1`,
    );
    expect(userList.status).toBe(200);
    expect(userList.body.data.map(({ id }) => id)).toContain(ids.usuario);
    expect(userList.body.meta.page).toBe(1);

    const duplicateUser = await request('/usuarios', 'POST', {
      nome: 'Duplicado',
      email: `integracao-${suffix}@example.test`,
      senha: 'SenhaSegura123',
      role: 'usuario',
    });
    expect(duplicateUser.status).toBe(409);

    const createdCollector = await request<{ id: string }>(
      '/api/coletor',
      'POST',
      { localizacao: 'Bloco A', capacidadeMaxima: 10 },
    );
    expect(createdCollector.status).toBe(201);
    ids.coletor = createdCollector.body.id;

    const collectorList = await request<{
      data: Array<{ id: string; volumeAtual: number }>;
    }>('/api/coletor?localizacao=Bloco');
    expect(collectorList.body.data.map(({ id }) => id)).toContain(ids.coletor);

    const createdObject = await request<{ id: string }>(
      '/objetos',
      'POST',
      {
        nome: 'Placa eletrônica',
        descricao: 'Componente para reuso',
        tipo: 'eletrônico',
        pesoKg: 1.25,
      },
    );
    expect(createdObject.status).toBe(201);
    ids.objeto = createdObject.body.id;

    const objectList = await request<{
      data: Array<{ id: string; pesoKg: number }>;
    }>('/objetos?tipo=eletrônico&ativo=true&limit=1');
    expect(objectList.body.data.map(({ id }) => id)).toContain(ids.objeto);
    expect(objectList.body.data[0].pesoKg).toBe(1.25);

    const invalidPage = await request('/objetos?page=0');
    expect(invalidPage.status).toBe(400);

    const missingUserDisposal = await request('/descarte', 'POST', {
      tipoResiduo: 'eletrônico',
      pesoKg: 1,
      destino: 'Triagem',
      usuarioId: '00000000-0000-4000-8000-000000000000',
      coletorId: ids.coletor,
    });
    expect(missingUserDisposal.status).toBe(404);

    const createdDisposal = await request<{
      id: string;
      itens: Array<{ objetoId: string; quantidade: number }>;
      pesoKg: number;
    }>('/descarte', 'POST', {
      tipoResiduo: 'eletrônico',
      pesoKg: 2,
      destino: 'Triagem',
      usuarioId: ids.usuario,
      coletorId: ids.coletor,
      itens: [{ objetoId: ids.objeto, quantidade: 2 }],
    });
    expect(createdDisposal.status).toBe(201);
    expect(createdDisposal.body.itens).toEqual([
      expect.objectContaining({
        objetoId: ids.objeto,
        quantidade: 2,
      }),
    ]);
    ids.descarte = createdDisposal.body.id;

    const collectorAfterDisposal = await request<{
      volumeAtual: number;
    }>(`/api/coletor/${ids.coletor}`);
    expect(collectorAfterDisposal.body.volumeAtual).toBe(2);

    const disposalList = await request<{
      data: Array<{ id: string }>;
      meta: { total: number };
    }>(`/descarte?status=pendente&coletorId=${ids.coletor}&page=1&limit=10`);
    expect(disposalList.body.data.map(({ id }) => id)).toContain(ids.descarte);
    expect(disposalList.body.meta.total).toBeGreaterThanOrEqual(1);

    const updatedUser = await request<{ nome: string }>(
      `/usuarios/${ids.usuario}`,
      'PATCH',
      { nome: 'Usuário atualizado' },
    );
    expect(updatedUser.status).toBe(200);
    expect(updatedUser.body.nome).toBe('Usuário atualizado');

    const updatedObject = await request<{ tipo: string }>(
      `/objetos/${ids.objeto}`,
      'PATCH',
      { tipo: 'reutilizável' },
    );
    expect(updatedObject.status).toBe(200);
    expect(updatedObject.body.tipo).toBe('reutilizável');

    const updatedCollector = await request<{ localizacao: string }>(
      `/api/coletor/${ids.coletor}`,
      'PATCH',
      { localizacao: 'Bloco B' },
    );
    expect(updatedCollector.status).toBe(200);
    expect(updatedCollector.body.localizacao).toBe('Bloco B');

    const capacityTooSmall = await request(
      `/api/coletor/${ids.coletor}`,
      'PATCH',
      { capacidadeMaxima: 1 },
    );
    expect(capacityTooSmall.status).toBe(400);

    const capacityExceeded = await request(
      `/api/coletor/${ids.coletor}/atualizar`,
      'POST',
      { volume: 9 },
    );
    expect(capacityExceeded.status).toBe(400);

    const updatedDisposal = await request<{ status: string; pesoKg: number }>(
      `/descarte/${ids.descarte}`,
      'PATCH',
      { status: 'processado', pesoKg: 3 },
    );
    expect(updatedDisposal.status).toBe(200);
    expect(updatedDisposal.body.status).toBe('processado');
    expect(updatedDisposal.body.pesoKg).toBe(3);

    const objectInUse = await request(`/objetos/${ids.objeto}`, 'DELETE');
    expect(objectInUse.status).toBe(409);

    const userWithHistory = await request(
      `/usuarios/${ids.usuario}`,
      'DELETE',
    );
    expect(userWithHistory.status).toBe(409);

    const resetCollector = await request<{ volumeAtual: number }>(
      `/api/coletor/${ids.coletor}/reset`,
      'POST',
    );
    expect(resetCollector.status).toBe(201);
    expect(resetCollector.body.volumeAtual).toBe(0);
    const finalizedDisposal = await request<{ status: string }>(
      `/descarte/${ids.descarte}`,
    );
    expect(finalizedDisposal.body.status).toBe('finalizado');

    expect(
      (await request(`/descarte/${ids.descarte}`, 'DELETE')).status,
    ).toBe(200);
    ids.descarte = undefined;

    const archiveCollector = await request<{ id: string }>(
      '/api/coletor',
      'POST',
      { localizacao: 'Depósito de teste', capacidadeMaxima: 5 },
    );
    expect(archiveCollector.status).toBe(201);
    ids.archiveCollector = archiveCollector.body.id;

    const archiveDisposal = await request<{ id: string }>(
      '/descarte',
      'POST',
      {
        tipoResiduo: 'eletrônico',
        pesoKg: 1,
        destino: 'Arquivo',
        usuarioId: ids.usuario,
        coletorId: ids.archiveCollector,
      },
    );
    expect(archiveDisposal.status).toBe(201);
    ids.archiveDisposal = archiveDisposal.body.id;

    expect(
      (await request(`/api/coletor/${ids.archiveCollector}`, 'DELETE')).status,
    ).toBe(200);
    ids.archiveCollector = undefined;
    const preservedDisposal = await request<{ coletorId: string | null }>(
      `/descarte/${ids.archiveDisposal}`,
    );
    expect(preservedDisposal.body.coletorId).toBeNull();
    expect(
      (await request(`/descarte/${ids.archiveDisposal}`, 'DELETE')).status,
    ).toBe(200);
    ids.archiveDisposal = undefined;

    expect(
      (await request(`/objetos/${ids.objeto}`, 'DELETE')).status,
    ).toBe(200);
    ids.objeto = undefined;
    expect(
      (await request(`/api/coletor/${ids.coletor}`, 'DELETE')).status,
    ).toBe(200);
    ids.coletor = undefined;
    expect(
      (await request(`/usuarios/${ids.usuario}`, 'DELETE')).status,
    ).toBe(200);
    ids.usuario = undefined;
  }, 30000);
});
