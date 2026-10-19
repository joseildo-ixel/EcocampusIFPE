import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ColetorService } from './coletor.service';
import { Coletor } from './entities/coletor.entity';

describe('ColetorService', () => {
  let service: ColetorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColetorService,
        { provide: getRepositoryToken(Coletor), useValue: {} },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    service = module.get<ColetorService>(ColetorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
