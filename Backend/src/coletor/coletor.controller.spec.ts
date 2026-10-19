import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ColetorController } from './coletor.controller';
import { ColetorService } from './coletor.service';

describe('ColetorController', () => {
  let controller: ColetorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColetorController],
      providers: [{ provide: ColetorService, useValue: {} }],
    }).compile();

    controller = module.get<ColetorController>(ColetorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
