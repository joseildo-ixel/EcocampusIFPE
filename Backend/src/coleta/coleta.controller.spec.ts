import { Test, TestingModule } from '@nestjs/testing';
import { ColetaController } from './coleta.controller';
import { ColetaService } from './coleta.service';

describe('ColetaController', () => {
  let controller: ColetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColetaController],
      providers: [ColetaService],
    }).compile();

    controller = module.get<ColetaController>(ColetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
