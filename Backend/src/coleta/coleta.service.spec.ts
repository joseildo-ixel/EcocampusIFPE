import { Test, TestingModule } from '@nestjs/testing';
import { ColetaService } from './coleta.service';

describe('ColetaService', () => {
  let service: ColetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColetaService],
    }).compile();

    service = module.get<ColetaService>(ColetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
