import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjetosService } from './objetos.service';
import { Objeto } from './entities/objeto.entity';

describe('ObjetosService', () => {
  let service: ObjetosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjetosService,
        { provide: getRepositoryToken(Objeto), useValue: {} },
      ],
    }).compile();

    service = module.get<ObjetosService>(ObjetosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
