import { Test, TestingModule } from '@nestjs/testing';
import { ObjetosService } from './objetos.service';

describe('ObjetosService', () => {
  let service: ObjetosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjetosService],
    }).compile();

    service = module.get<ObjetosService>(ObjetosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
