import { Test, TestingModule } from '@nestjs/testing';
import { CostumerServiceService } from './costumer-service.service';

describe('CostumerServiceService', () => {
  let service: CostumerServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostumerServiceService],
    }).compile();

    service = module.get<CostumerServiceService>(CostumerServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
