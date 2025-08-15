import { Test, TestingModule } from '@nestjs/testing';
import { CostumerServiceController } from './costumer-service.controller';
import { CostumerServiceService } from './costumer-service.service';

describe('CostumerServiceController', () => {
  let controller: CostumerServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostumerServiceController],
      providers: [CostumerServiceService],
    }).compile();

    controller = module.get<CostumerServiceController>(CostumerServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
