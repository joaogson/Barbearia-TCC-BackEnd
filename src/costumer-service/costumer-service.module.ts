import { Module } from "@nestjs/common";
import { CostumerService } from "./costumer-service.service";
import { CostumerServiceController } from "./costumer-service.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CostumerServiceController],
  providers: [CostumerService],
})
export class CostumerServiceModule {}
