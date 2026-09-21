import { Test, TestingModule } from '@nestjs/testing';
import { ColetorService } from './coletor.service';

describe('ColetorService', () => {
  let service: ColetorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColetorService],
    }).compile();

    service = module.get<ColetorService>(ColetorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
