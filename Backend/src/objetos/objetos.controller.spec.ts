import { Test, TestingModule } from '@nestjs/testing';
import { ObjetosController } from './objetos.controller';
import { ObjetosService } from './objetos.service';

describe('ObjetosController', () => {
  let controller: ObjetosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjetosController],
      providers: [ObjetosService],
    }).compile();

    controller = module.get<ObjetosController>(ObjetosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
