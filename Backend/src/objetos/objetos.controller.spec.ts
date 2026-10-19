import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ObjetosController } from './objetos.controller';
import { ObjetosService } from './objetos.service';

describe('ObjetosController', () => {
  let controller: ObjetosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjetosController],
      providers: [{ provide: ObjetosService, useValue: {} }],
    }).compile();

    controller = module.get<ObjetosController>(ObjetosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
