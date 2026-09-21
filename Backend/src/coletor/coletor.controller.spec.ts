import { Test, TestingModule } from '@nestjs/testing';
import { ColetorController } from './coletor.controller';
import { ColetorService } from './coletor.service';

describe('ColetorController', () => {
  let controller: ColetorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColetorController],
      providers: [ColetorService],
    }).compile();

    controller = module.get<ColetorController>(ColetorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
