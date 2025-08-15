import { Module } from '@nestjs/common';
import { CostumerServiceService } from './costumer-service.service';
import { CostumerServiceController } from './costumer-service.controller';

@Module({
  controllers: [CostumerServiceController],
  providers: [CostumerServiceService],
})
export class CostumerServiceModule {}
